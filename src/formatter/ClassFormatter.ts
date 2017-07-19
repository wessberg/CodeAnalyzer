import {ClassDeclaration, SyntaxKind} from "typescript";
import {isConstructorDeclaration, isGetAccessorDeclaration, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration} from "../predicate/PredicateFunctions";
import {config} from "../static/Config";
import {IClassFormatter} from "./interface/IClassFormatter";
import {cache, constructorFormatter, decoratorsFormatter, getAccessorFormatter, heritageClauseFormatter, identifierUtil, mapper, methodFormatter, modifiersFormatter, propFormatter, setAccessorFormatter, sourceFilePropertiesGetter, valueableFormatter} from "../services";
import {IClassDeclaration, IdentifierMapKind} from "../identifier/interface/IIdentifier";

/**
 * A class that can format any kind of relevant statement into an IClassFormatter
 */
export class ClassFormatter implements IClassFormatter {

	/**
	 * Formats the given ClassDeclaration into an IClassDeclaration.
	 * @param {ClassDeclaration} statement
	 * @returns {IClassDeclaration}
	 */
	public format (statement: ClassDeclaration): IClassDeclaration {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const fileContents = sourceFileProperties.fileContents;
		const className = statement.name == null ? config.name.anonymous : statement.name.text;

		const cachedClass = cache.getCachedClass(filePath, className);
		if (cachedClass != null && !cache.cachedClassNeedsUpdate(cachedClass.content)) return cachedClass.content;

		const classDeclarationStartsAt = statement.pos;
		const classDeclarationEndsAt = statement.end;
		const classBodyStartsAt = statement.members.pos;
		const classBodyEndsAt = statement.members.end;
		const fullClassContents = fileContents.slice(classDeclarationStartsAt, classDeclarationEndsAt);
		const bodyClassContents = fileContents.slice(classBodyStartsAt, classBodyEndsAt);
		const value = valueableFormatter.format(statement);
		const that = this;

		let hasMerged: boolean = false;

		const declaration: IClassDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.CLASS,
			name: className,
			filePath,
			methods: {},
			modifiers: modifiersFormatter.format(statement),
			heritage: statement.heritageClauses == null ? null : heritageClauseFormatter.format(statement.heritageClauses),
			decorators: decoratorsFormatter.format(statement),
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

			/**
			 * Merges the class with its super class (if it has any or if it hasn't merged already)
			 */
			mergeWithParent () {
				if (hasMerged) return;
				that.mergeWithParent(this);
				hasMerged = true;
			}
		}, IdentifierMapKind.CLASS);

		statement.members.forEach(member => {

			if (isPropertyDeclaration(member)) {
				const formatted = propFormatter.format(member, className);
				const cached = cache.getCachedProp(filePath, declaration.name, formatted.name);
				if (cached != null && !cache.cachedPropNeedsUpdate(cached.content)) declaration.props[cached.content.name] = cached.content;
				else {
					declaration.props[formatted.name] = formatted;
					cache.setCachedProp(filePath, formatted);
				}
			}

			else if (isConstructorDeclaration(member)) {
				declaration.constructor = constructorFormatter.format(member, className);
			}

			else if (isMethodDeclaration(member)) {
				const formatted = methodFormatter.format(member, className);
				declaration.methods[formatted.name] = formatted;
			}

			else if (isGetAccessorDeclaration(member)) {
				const formatted = getAccessorFormatter.format(member, className);
				declaration.methods[formatted.name] = formatted;
			}

			else if (isSetAccessorDeclaration(member)) {
				const formatted = setAccessorFormatter.format(member, className);
				declaration.methods[formatted.name] = formatted;
			}

			else throw new TypeError(`${ClassFormatter.constructor.name} didn't understand a class member of type ${SyntaxKind[member.kind]}`);
		});

		mapper.set(declaration, statement);
		cache.setCachedClass(filePath, declaration);
		return declaration;
	}

	/**
	 * Merges all relevant properties of the derived class with its super class.
	 * This means that the derived class will inherit methods, properties and the constructor through
	 * classical inheritance.
	 * @param {IClassDeclaration} declaration
	 */
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
		if (declaration.constructor == null && base.constructor != null) {
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