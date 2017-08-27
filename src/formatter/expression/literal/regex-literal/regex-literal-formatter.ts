import {RegularExpressionLiteral} from "typescript";
import {IRegexLiteralFormatter} from "./i-regex-literal-formatter";
import {CacheServiceGetter} from "../../../../service/cache-service/cache-service-getter";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";
import {IFormattedRegexLiteral} from "./i-formatted-regex-literal";

/**
 * A class that can format regular expression literals
 */
export class RegexLiteralFormatter extends FormattedExpressionFormatter implements IRegexLiteralFormatter {
	constructor (private cacheService: CacheServiceGetter) {
		super();
	}

	/**
	 * Formats the given RegularExpressionLiteral into an IFormattedRegexLiteral
	 * @param {RegularExpressionLiteral} expression
	 * @returns {IFormattedRegexLiteral}
	 */
	public format (expression: RegularExpressionLiteral): IFormattedRegexLiteral {

		const result: IFormattedRegexLiteral = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.REGEX_LITERAL,
			value: new Function(`return ${expression.text}`)()
		};

		// Map the formatted expression to the relevant statement
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedRegexLiteral
	 * @param {IFormattedRegexLiteral} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedRegexLiteral): string {
		return `${formatted.value}`;
	}

}