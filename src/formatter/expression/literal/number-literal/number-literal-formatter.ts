import {NumericLiteral} from "typescript";
import {INumberLiteralFormatter} from "./i-number-literal-formatter";
import {CacheServiceGetter} from "../../../../service/cache-service/cache-service-getter";
import {IFormattedNumberLiteral} from "./i-formatted-number-literal";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";

/**
 * A class that can format numeric literals
 */
export class NumberLiteralFormatter extends FormattedExpressionFormatter implements INumberLiteralFormatter {
	constructor (private cacheService: CacheServiceGetter) {
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
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

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