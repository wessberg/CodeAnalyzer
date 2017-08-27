import {IIdentifierFormatter} from "./i-identifier-formatter";
import {Identifier} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedIdentifier} from "@wessberg/type";

/**
 * A class that can format Identifiers
 */
export class IdentifierFormatter extends FormattedExpressionFormatter implements IIdentifierFormatter {
	constructor (private astMapper: AstMapperGetter) {
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
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

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