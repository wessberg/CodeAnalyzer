import {IIdentifierFormatter} from "./i-identifier-formatter";
import {Identifier} from "typescript";
import {IFormattedIdentifier} from "./i-formatted-identifier";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";
import {CacheServiceGetter} from "../../../service/cache-service/cache-service-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";

/**
 * A class that can format Identifiers
 */
export class IdentifierFormatter extends FormattedExpressionFormatter implements IIdentifierFormatter {
	constructor (private cacheService: CacheServiceGetter) {
		super();
	}

	/**
	 * Formats the given Identifier into an IFormattedIdentifier
	 * @param {Identifier} expression
	 * @returns {IFormattedIdentifier}
	 */
	public format (expression: Identifier): IFormattedIdentifier {

		const result: IFormattedIdentifier = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.IDENTIFIER,
			name: expression.text
		};

		// Map the formatted expression to the relevant statement
		this.cacheService().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedIdentifier
	 * @param {IFormattedIdentifier} formattedIdentifier
	 * @returns {string}
	 */
	private stringify (formattedIdentifier: IFormattedIdentifier): string {
		return formattedIdentifier.name;
	}

}