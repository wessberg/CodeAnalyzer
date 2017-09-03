import {BooleanLiteral, SyntaxKind} from "typescript";
import {IBooleanLiteralFormatter} from "./i-boolean-literal-formatter";
import {AstMapperGetter} from "../../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedBooleanLiteral} from "@wessberg/type";

/**
 * A class that can format boolean literals
 */
export class BooleanLiteralFormatter extends FormattedExpressionFormatter implements IBooleanLiteralFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the given NumericLiteral into an IFormattedBooleanLiteral
	 * @param {BooleanLiteral} expression
	 * @returns {IFormattedBooleanLiteral}
	 */
	public format (expression: BooleanLiteral): IFormattedBooleanLiteral {

		const result: IFormattedBooleanLiteral = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.BOOLEAN_LITERAL,
			value: expression.kind === SyntaxKind.TrueKeyword
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedBooleanLiteral
	 * @param {IFormattedBooleanLiteral} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedBooleanLiteral): string {
		return `${formatted.value}`;
	}

}