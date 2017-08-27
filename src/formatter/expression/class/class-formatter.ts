import {ClassDeclaration, ClassExpression, SyntaxKind} from "typescript";
import {IClassFormatter} from "./i-class-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {HeritageFormatterGetter} from "../heritage/heritage-formatter-getter";
import {FormattedExpressionKind, IFormattedClass, IFormattedExtendsHeritage, IFormattedImplementsHeritage} from "@wessberg/type";

/**
 * A class that can format class declarations and class expressions
 */
export class ClassFormatter extends FormattedExpressionFormatter implements IClassFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private astMapper: AstMapperGetter,
							 private heritageFormatter: HeritageFormatterGetter) {
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
			// Class expressions may not have a name (for example, 'export default class {...}')
			name: expression.name == null ? null : this.astUtil.takeName(expression.name),
			// Format the 'extends' heritage
			extends: extendsClause == null ? null : <IFormattedExtendsHeritage> this.heritageFormatter().format(extendsClause),
			// Format the 'implements' heritage
			implements: implementsClause == null ? null : <IFormattedImplementsHeritage> this.heritageFormatter().format(implementsClause),
			expressionKind: FormattedExpressionKind.CLASS
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedClass
	 * @param {IFormattedClass} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedClass): string {
		let str = "class ";
		// Add the class name if it has any
		if (formatted.name != null) str += `${formatted.name} `;
		// Add the 'extends' relation
		if (formatted.extends != null) str += `${formatted.extends.toString()} `;
		// Add the 'implements' relation
		if (formatted.implements != null) str += `${formatted.implements.toString()} `;
		// Add the opening bracket
		str += "{";
		// Add the closing bracket
		str += "}";
		return str;
	}

}