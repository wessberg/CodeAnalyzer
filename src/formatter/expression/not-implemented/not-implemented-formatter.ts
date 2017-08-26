import {INotImplementedFormatter} from "./i-not-implemented-formatter";
import {Expression, SyntaxKind} from "typescript";
import {IFormattedNotImplemented} from "./i-formatted-not-implemented";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";
import {CacheServiceGetter} from "../../../service/cache-service/cache-service-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";

/**
 * A class that can format 'NotImplemented' expressions. These are placeholders until expressions of a
 * given SyntaxKind is implemented
 */
export class NotImplementedFormatter extends FormattedExpressionFormatter implements INotImplementedFormatter {
	constructor (private cacheService: CacheServiceGetter) {
		super();
	}

	/**
	 * Formats the given Expression into an IFormattedNotImplemented
	 * @param {Expression} expression
	 * @returns {IFormattedNotImplemented}
	 */
	public format (expression: Expression): IFormattedNotImplemented {

		const result: IFormattedNotImplemented = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.NOT_IMPLEMENTED,
			syntaxKind: SyntaxKind[expression.kind]
		};

		// Map the formatted expression to the relevant statement
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify();
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedNotImplemented
	 * @returns {string}
	 */
	private stringify (): string {
		return "<<NOT IMPLEMENTED>>";
	}

}