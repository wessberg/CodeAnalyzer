import {BooleanLiteral, SyntaxKind} from "typescript";
import {IBooleanLiteralFormatter} from "./i-boolean-literal-formatter";
import {CacheServiceGetter} from "../../../../service/cache-service/cache-service-getter";
import {IFormattedBooleanLiteral} from "./i-formatted-boolean-literal";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";

/**
 * A class that can format boolean literals
 */
export class BooleanLiteralFormatter extends FormattedExpressionFormatter implements IBooleanLiteralFormatter {
	constructor (private cacheService: CacheServiceGetter) {
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
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

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