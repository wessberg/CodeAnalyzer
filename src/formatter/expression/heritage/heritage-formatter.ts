import {HeritageClause, SyntaxKind} from "typescript";
import {IHeritageFormatter} from "./i-heritage-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {ReferenceTypeFormatterGetter} from "../../type/reference-type-formatter/reference-type-formatter-getter";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";
import {FormattedExpressionKind, FormattedHeritage} from "@wessberg/type";

/**
 * A class that can format heritage clauses
 */
export class HeritageFormatter extends FormattedExpressionFormatter implements IHeritageFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private expressionFormatter: ExpressionFormatterGetter,
							 private referenceTypeFormatter: ReferenceTypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the given HeritageClause into an FormattedHeritage
	 * @param {HeritageClause} expression
	 * @returns {FormattedHeritage}
	 */
	public format (expression: HeritageClause): FormattedHeritage {
		const base = {
			...super.format(expression)
		};

		const result: FormattedHeritage = expression.token === SyntaxKind.ExtendsKeyword
			? {...base, expressionKind: FormattedExpressionKind.EXTENDS, members: expression.types.map(node => this.expressionFormatter().format(node))}
			: {...base, expressionKind: FormattedExpressionKind.IMPLEMENTS, members: expression.types.map(node => this.referenceTypeFormatter().format({node}))};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedHeritage
	 * @param {FormattedHeritage} formatted
	 * @returns {string}
	 */
	private stringify (formatted: FormattedHeritage): string {
		let str = "";
		// Add the 'implements' or 'extends' prefix
		if (formatted.expressionKind === FormattedExpressionKind.IMPLEMENTS) str += "implements ";
		else if (formatted.expressionKind === FormattedExpressionKind.EXTENDS) str += "extends ";

		// Typescript wants to qualify the type of the members array before type-checking
		if (formatted.expressionKind === FormattedExpressionKind.EXTENDS) {
			str += formatted.members.map(member => member.toString()).join(", ");
		} else {
			str += formatted.members.map(member => member.toString()).join(", ");
		}
		return str;
	}

}