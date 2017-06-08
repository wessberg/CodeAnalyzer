import {ClassDeclaration, SyntaxKind} from "typescript";
import {ICache} from "../cache/interface/ICache";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {isConstructorDeclaration, isGetAccessorDeclaration, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration} from "../predicate/PredicateFunctions";
import {IClassDeclaration, IdentifierMapKind} from "../service/interface/ICodeAnalyzer";
import {Config} from "../static/Config";
import {IClassFormatter} from "./interface/IClassFormatter";
import {IConstructorFormatter} from "./interface/IConstructorFormatter";
import {IDecoratorsFormatter} from "./interface/IDecoratorsFormatter";
import {IHeritageClauseFormatter} from "./interface/IHeritageClauseFormatter";
import {IMethodFormatter} from "./interface/IMethodFormatter";
import {IModifiersFormatter} from "./interface/IModifiersFormatter";
import {IPropFormatter} from "./interface/IPropFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";
import {IGetAccessorFormatter} from "./interface/IGetAccessorFormatter";
import {ISetAccessorFormatter} from "./interface/ISetAccessorFormatter";

export class ClassFormatter implements IClassFormatter {

	constructor (private mapper: IMapper,
							 private cache: ICache,
							 private decoratorsFormatter: IDecoratorsFormatter,
							 private propFormatter: IPropFormatter,
							 private methodFormatter: IMethodFormatter,
							 private getAccessorFormatter: IGetAccessorFormatter,
							 private setAccessorFormatter: ISetAccessorFormatter,
							 private constructorFormatter: IConstructorFormatter,
							 private modifiersFormatter: IModifiersFormatter,
							 private valueableFormatter: IValueableFormatter,
							 private heritageClauseFormatter: IHeritageClauseFormatter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter) {
	}

	format (statement: ClassDeclaration): IClassDeclaration {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const fileContents = sourceFileProperties.fileContents;
		const className = statement.name == null ? Config.name.anonymous : statement.name.text;

		const cached = this.cache.getCachedClass(filePath, className);
		if (cached != null && !this.cache.cachedClassNeedsUpdate(cached.content)) return cached.content;

		const classDeclarationStartsAt = statement.pos;
		const classDeclarationEndsAt = statement.end;
		const classBodyStartsAt = statement.members.pos;
		const classBodyEndsAt = statement.members.end;
		const fullClassContents = fileContents.slice(classDeclarationStartsAt, classDeclarationEndsAt);
		const bodyClassContents = fileContents.slice(classBodyStartsAt, classBodyEndsAt);
		const value = this.valueableFormatter.format(statement);
		const that = this;

		let hasMerged: boolean = false;

		const declaration: IClassDeclaration = {
			___kind: IdentifierMapKind.CLASS,
			name: className,
			filePath,
			methods: {},
			modifiers: this.modifiersFormatter.format(statement),
			heritage: statement.heritageClauses == null ? null : this.heritageClauseFormatter.format(statement.heritageClauses),
			decorators: this.decoratorsFormatter.format(statement),
			constructor: null,
			startsAt: classDeclarationStartsAt,
			endsAt: classDeclarationEndsAt,
			contents: fullClassContents,
			body: {
				startsAt: classBodyStartsAt,
				endsAt: classBodyEndsAt,
				contents: bodyClassContents
			},
			props: {},
			value,
			mergeWithParent () {
				if (hasMerged) return;
				that.mergeWithParent(this);
				hasMerged = true;
			}
		};

		statement.members.forEach(member => {

			if (isPropertyDeclaration(member)) {
				const formatted = this.propFormatter.format(member, className);
				const cached = this.cache.getCachedProp(filePath, declaration.name, formatted.name);
				if (cached != null && !this.cache.cachedPropNeedsUpdate(cached.content)) declaration.props[cached.content.name] = cached.content;
				else {
					declaration.props[formatted.name] = formatted;
					this.cache.setCachedProp(filePath, formatted);
				}
			}

			else if (isConstructorDeclaration(member)) {
				declaration.constructor = this.constructorFormatter.format(member, className);
			}

			else if (isMethodDeclaration(member)) {
				const formatted = this.methodFormatter.format(member, className);
				declaration.methods[formatted.name] = formatted;
			}

			else if (isGetAccessorDeclaration(member)) {
				const formatted = this.getAccessorFormatter.format(member, className);
				declaration.methods[formatted.name] = formatted;
			}

			else if (isSetAccessorDeclaration(member)) {
				const formatted = this.setAccessorFormatter.format(member, className);
				declaration.methods[formatted.name] = formatted;
			}

			else throw new TypeError(`${ClassFormatter.constructor.name} didn't understand a class member of type ${SyntaxKind[member.kind]}`);
		});

		// Make the kind non-enumerable.
		Object.defineProperty(declaration, "___kind", {
			value: IdentifierMapKind.CLASS,
			enumerable: false
		});

		this.mapper.set(declaration, statement);
		this.cache.setCachedClass(filePath, declaration);
		return declaration;
	}

	private mergeWithParent (declaration: IClassDeclaration): void {
		if (declaration.heritage == null || declaration.heritage.extendsClass == null) return;

		// Merge in the parent class properties.
		const base = declaration.heritage.extendsClass.resolve();
		if (base == null) {
			// It the base class couldn't be resolved, it is probably a built-in class (such as HTMLElement).
			return;
		}

		base.mergeWithParent();

		// Merge in the parent constructor.
		if (declaration.constructor == null) {
			declaration.constructor = {
				...base.constructor,
				...{
					className: declaration.name
				}
			};
		}

		// Merge in the parent classes methods.
		Object.keys(base.methods).forEach(methodName => {
			if (declaration.methods[methodName] == null) declaration.methods[methodName] = {
				...base.methods[methodName],
				...{
					className: declaration.name
				}
			};
		});

		// Merge in the parent classes props
		Object.keys(base.props).forEach(propName => {
			if (declaration.props[propName] == null) declaration.props[propName] = {
				...base.props[propName],
				...{
					className: declaration.name
				}
			};
		});
	}

}