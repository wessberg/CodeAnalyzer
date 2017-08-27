import {ClassDeclaration, ClassElement, ClassExpression, isConstructorDeclaration, isGetAccessorDeclaration, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration, SyntaxKind} from "typescript";
import {IClassFormatter} from "./i-class-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {HeritageFormatterGetter} from "../heritage/heritage-formatter-getter";
import {FormattedClassMember, FormattedExpressionKind, IFormattedClass, IFormattedExtendsHeritage, IFormattedImplementsHeritage} from "@wessberg/type";
import {DecoratorFormatterGetter} from "../decorator/decorator-formatter-getter";
import {ClassAccessorFormatterGetter} from "../class-accessor/class-accessor-formatter-getter";
import {ClassMethodFormatterGetter} from "../class-method/class-method-formatter-getter";
import {ClassPropertyFormatterGetter} from "../class-property/class-property-formatter-getter";
import {ClassConstructorFormatterGetter} from "../class-constructor/class-constructor-formatter-getter";

/**
 * A class that can format class declarations and class expressions
 */
export class ClassFormatter extends FormattedExpressionFormatter implements IClassFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private astMapper: AstMapperGetter,
							 private classAccessorFormatter: ClassAccessorFormatterGetter,
							 private classConstructorFormatter: ClassConstructorFormatterGetter,
							 private classMethodFormatter: ClassMethodFormatterGetter,
							 private classPropertyFormatter: ClassPropertyFormatterGetter,
							 private heritageFormatter: HeritageFormatterGetter,
							 private decoratorFormatter: DecoratorFormatterGetter) {
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

		const result: IFormattedClass = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.CLASS,
			// Class expressions may not have a name (for example, 'export default class {...}')
			name: expression.name == null ? null : this.astUtil.takeName(expression.name),
			// Format the 'extends' heritage
			extends: extendsClause == null ? null : <IFormattedExtendsHeritage> this.heritageFormatter().format(extendsClause),
			// Format the 'implements' heritage
			implements: implementsClause == null ? null : <IFormattedImplementsHeritage> this.heritageFormatter().format(implementsClause),
			decorators: expression.decorators == null ? [] : expression.decorators.map(decorator => this.decoratorFormatter().format(decorator)),
			members: expression.members.map(member => this.handleClassMember(member))
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Handles a class member by converting into a FormattedClassMember
	 * @param {ClassElement} classElement
	 * @returns {FormattedClassMember}
	 */
	private handleClassMember (classElement: ClassElement): FormattedClassMember {
		if (isGetAccessorDeclaration(classElement) || isSetAccessorDeclaration(classElement)) {
			return this.classAccessorFormatter().format(classElement);
		}

		else if (isMethodDeclaration(classElement)) {
			return this.classMethodFormatter().format(classElement);
		}

		else if (isPropertyDeclaration(classElement)) {
			return this.classPropertyFormatter().format(classElement);
		}

		else if (isConstructorDeclaration(classElement)) {
			return this.classConstructorFormatter().format(classElement);
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
		if (formatted.name != null) str += `${formatted.name} `;
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