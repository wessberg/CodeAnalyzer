import {NumericLiteral} from "typescript";
import {INumberLiteralFormatter} from "./i-number-literal-formatter";
import {AstMapperGetter} from "../../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedNumberLiteral} from "@wessberg/type";

/**
 * A class that can format numeric literals
 */
export class NumberLiteralFormatter extends FormattedExpressionFormatter implements INumberLiteralFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the given NumericLiteral into an IFormattedNumberLiteral
	 * @param {NumericLiteral} expression
	 * @returns {IFormattedNumberLiteral}
	 */
	public format (expression: NumericLiteral): IFormattedNumberLiteral {

		const result: IFormattedNumberLiteral = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.NUMBER_LITERAL,
			value: parseFloat(expression.text)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedStringLiteral
	 * @param {IFormattedNumberLiteral} formattedNumberLiteral
	 * @returns {string}
	 */
	private stringify (formattedNumberLiteral: IFormattedNumberLiteral): string {
		return `${formattedNumberLiteral.value}`;
	}

}