import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, isConstructorDeclaration, isGetAccessorDeclaration, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration, NodeArray, SyntaxKind} from "typescript";
import {IClassFormatter} from "./i-class-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {HeritageFormatterGetter} from "../heritage/heritage-formatter-getter";
import {FormattedClassMember, FormattedExpressionKind, IFormattedClass, IFormattedClassConstructor, IFormattedDecorator, IFormattedExtendsHeritage, IFormattedImplementsHeritage} from "@wessberg/type";
import {DecoratorFormatterGetter} from "../decorator/decorator-formatter-getter";
import {ClassAccessorFormatterGetter} from "../class-accessor/class-accessor-formatter-getter";
import {ClassMethodFormatterGetter} from "../class-method/class-method-formatter-getter";
import {ClassPropertyFormatterGetter} from "../class-property/class-property-formatter-getter";
import {ClassConstructorFormatterGetter} from "../class-constructor/class-constructor-formatter-getter";
import {IdentifierResolverGetter} from "../../../resolver/identifier-resolver/identifier-resolver-getter";
import {IdentifierFormatterGetter} from "../identifier/identifier-formatter-getter";
import {ImportServiceGetter} from "../../../service/import-service/import-service-getter";
import {ClassServiceGetter} from "../../../service/class-service/class-service-getter";

/**
 * A class that can format class declarations and class expressions
 */
export class ClassFormatter extends FormattedExpressionFormatter implements IClassFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private importService: ImportServiceGetter,
							 private classService: ClassServiceGetter,
							 private identifierFormatter: IdentifierFormatterGetter,
							 private classAccessorFormatter: ClassAccessorFormatterGetter,
							 private classConstructorFormatter: ClassConstructorFormatterGetter,
							 private classMethodFormatter: ClassMethodFormatterGetter,
							 private classPropertyFormatter: ClassPropertyFormatterGetter,
							 private heritageFormatter: HeritageFormatterGetter,
							 private decoratorFormatter: DecoratorFormatterGetter,
							 private identifierResolver: IdentifierResolverGetter) {
		super();
	}

	/**
	 * Formats the given ClassExpression or ClassDeclaration into an IFormattedClass
	 * @param {ClassExpression|ClassDeclaration} expression
	 * @returns {IFormattedClass}
	 */
	public format (expression: ClassExpression|ClassDeclaration): IFormattedClass {
		// Divide the heritage clauses into 'extends' and 'implements' relations
		const extendsClause = expression.heritageClauses == null ? null : expression.heritageClauses.find(clause => clause.token === SyntaxKind.ExtendsKeyword);
		const implementsClause = expression.heritageClauses == null ? null : expression.heritageClauses.find(clause => clause.token === SyntaxKind.ImplementsKeyword);

		// Format the 'extends' relationship
		const extendsFormatted = extendsClause == null ? null : <IFormattedExtendsHeritage> this.heritageFormatter().format(extendsClause);

		// Format the 'implements' relationship
		const implementsFormatted = implementsClause == null ? null : <IFormattedImplementsHeritage> this.heritageFormatter().format(implementsClause);

		// Format the members
		const members = this.getClassMembers(expression.members);

		// Format the constructor
		const constructor = this.getClassConstructor(expression.members);

		// Format the decorators
		const decorators = expression.decorators == null ? [] : expression.decorators.map(decorator => this.decoratorFormatter().format(decorator));

		// Format the name. Class expressions may not have a name (for example, 'export default class {...}')
		const name = expression.name == null ? null : this.identifierFormatter().format(expression.name);

		// Inherit from the parent
		const inherited = this.inherit(extendsFormatted);

		const result: IFormattedClass = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.CLASS,
			name,
			extends: extendsFormatted,
			implements: this.mergeImplements(implementsFormatted, inherited),
			decorators: this.mergeDecorators(decorators, inherited),
			members: this.mergeMembers(members, inherited),
			constructor: this.mergeConstructor(constructor, inherited)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Merges the IFormattedImplementsHeritage with the parent
	 * @param {IFormattedImplementsHeritage|null} own
	 * @param {IFormattedClass|null} inherited
	 * @returns {IFormattedImplementsHeritage|null}
	 */
	private mergeImplements (own: IFormattedImplementsHeritage|null, inherited: IFormattedClass|null): IFormattedImplementsHeritage|null {
		if (inherited == null || inherited.implements == null) return own;

		return own == null ? inherited.implements : {
			...own,
			members: [...own.members, ...inherited.implements.members]
		};
	}

	/**
	 * Merges the IFormattedDecorators with the parent
	 * @param {IFormattedDecorator[]} own
	 * @param {IFormattedClass} inherited
	 * @returns {IFormattedDecorator[]}
	 */
	private mergeDecorators (own: IFormattedDecorator[], inherited: IFormattedClass|null): IFormattedDecorator[] {
		if (inherited == null || inherited.decorators.length === 0) return own;
		return [...inherited.decorators, ...own];
	}

	/**
	 * Merges the class members with the parent
	 * @param {FormattedClassMember[]} own
	 * @param {IFormattedClass} inherited
	 * @returns {FormattedClassMember[]}
	 */
	private mergeMembers (own: FormattedClassMember[], inherited: IFormattedClass|null): FormattedClassMember[] {
		if (inherited == null || inherited.members.length === 0) return own;
		const members: FormattedClassMember[] = [...own];

		inherited.members.forEach(member => {
			const hasAlready = own.find(ownMember => ownMember.name === member.name) != null;
			if (!hasAlready) members.push(member);
		});
		return members;
	}

	/**
	 * Merges the constructor with an inherited one
	 * @param {IFormattedClassConstructor} own
	 * @param {IFormattedClass} inherited
	 * @returns {IFormattedClassConstructor}
	 */
	private mergeConstructor (own: IFormattedClassConstructor|null, inherited: IFormattedClass|null): IFormattedClassConstructor|null {
		if (inherited == null || inherited.constructor == null) return own;
		if (own == null) return inherited.constructor;
		return own.constructor != null ? own : inherited.constructor;
	}

	/**
	 * Returns inherited properties of an IFormattedClass
	 * @param {IFormattedExtendsHeritage} formatted
	 * @returns {IFormattedClass|null}
	 */
	private inherit (formatted: IFormattedExtendsHeritage|null): IFormattedClass|null {

		// Return an empty object if the formatted class doesn't exist
		if (formatted == null) return null;

		// Make sure that all of the classes declared in the imports has been resolved before proceeding
		const imports = this.importService().getImportedFilesForFile(formatted.file);
		imports.forEach(importedFile => this.classService().getClassesForFile(importedFile));

		// Resolve the class
		const [parent] = formatted.members;
		const resolvedParent = <IFormattedClass|null> this.identifierResolver().resolve(parent);
		if (resolvedParent == null) throw new ReferenceError(`${this.constructor.name} could not resolve the parent class for a class`);
		return resolvedParent;
	}

	/**
	 * Gets an IFormattedClassConstructor, if possible, from the provided NodeArray of ClassElements
	 * @param {NodeArray<ClassElement>} classElements
	 * @returns {IFormattedClassConstructor}
	 */
	private getClassConstructor (classElements: NodeArray<ClassElement>): IFormattedClassConstructor|null {
		const match = classElements.find(classElement => isConstructorDeclaration(classElement));
		return match == null ? null : this.classConstructorFormatter().format(<ConstructorDeclaration>match);
	}

	/**
	 * Gets all class members from the provided array of ClassElements
	 * @param {NodeArray<ClassElement>} classElements
	 * @returns {FormattedClassMember[]}
	 */
	private getClassMembers (classElements: NodeArray<ClassElement>): FormattedClassMember[] {
		return classElements
			.filter(classElement => !isConstructorDeclaration(classElement))
			.map(classElement => this.getClassMember(classElement));
	}

	/**
	 * Handles a class member by converting into a FormattedClassMember
	 * @param {ClassElement} classElement
	 * @returns {FormattedClassMember}
	 */
	private getClassMember (classElement: ClassElement): FormattedClassMember {
		if (isGetAccessorDeclaration(classElement) || isSetAccessorDeclaration(classElement)) {
			return this.classAccessorFormatter().format(classElement);
		}

		else if (isMethodDeclaration(classElement)) {
			return this.classMethodFormatter().format(classElement);
		}

		else if (isPropertyDeclaration(classElement)) {
			return this.classPropertyFormatter().format(classElement);
		}

		else {
			throw new ReferenceError(`${this.constructor.name} could not format a class element of kind ${SyntaxKind[classElement.kind]}`);
		}
	}

	/**
	 * Generates a string representation of the IFormattedClass
	 * @param {IFormattedClass} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedClass): string {
		let str = "";
		// Add decorators in top
		str += `${formatted.decorators.map(decorator => decorator.toString()).join("\n")}\n`;

		// Add the class signature
		str += "class ";
		// Add the class name if it has any
		if (formatted.name != null) str += `${formatted.name.toString()} `;
		// Add the 'extends' relation
		if (formatted.extends != null) str += `${formatted.extends.toString()} `;
		// Add the 'implements' relation
		if (formatted.implements != null) str += `${formatted.implements.toString()} `;
		// Add the opening bracket
		str += "{";
		str += `\n${formatted.members.map(member => member.toString()).join("\n")}\n`;
		// Add the closing bracket
		str += "}";
		return str;
	}

}