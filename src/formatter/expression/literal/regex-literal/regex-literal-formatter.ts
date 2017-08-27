import {RegularExpressionLiteral} from "typescript";
import {IRegexLiteralFormatter} from "./i-regex-literal-formatter";
import {AstMapperGetter} from "../../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedRegexLiteral} from "@wessberg/type";

/**
 * A class that can format regular expression literals
 */
export class RegexLiteralFormatter extends FormattedExpressionFormatter implements IRegexLiteralFormatter {
	constructor (private astMapper: AstMapperGetter) {
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
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

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