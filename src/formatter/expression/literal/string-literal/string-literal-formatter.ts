import {StringLiteral} from "typescript";
import {IStringLiteralFormatter} from "./i-string-literal-formatter";
import {CacheServiceGetter} from "../../../../service/cache-service/cache-service-getter";
import {IFormattedStringLiteral} from "./i-formatted-string-literal";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";

/**
 * A class that can format String literals
 */
export class StringLiteralFormatter extends FormattedExpressionFormatter implements IStringLiteralFormatter {
	constructor (private cacheService: CacheServiceGetter) {
		super();
	}

	/**
	 * Formats the given StringLiteral into an IFormattedStringLiteral
	 * @param {StringLiteral} expression
	 * @returns {IFormattedStringLiteral}
	 */
	public format (expression: StringLiteral): IFormattedStringLiteral {

		const result: IFormattedStringLiteral = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.STRING_LITERAL,
			value: expression.text
		};

		// Map the formatted expression to the relevant statement
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedStringLiteral
	 * @param {IFormattedStringLiteral} formattedStringLiteral
	 * @returns {string}
	 */
	private stringify (formattedStringLiteral: IFormattedStringLiteral): string {
		return formattedStringLiteral.value;
	}

}