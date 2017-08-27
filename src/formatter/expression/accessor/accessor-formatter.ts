import {IAccessorFormatter} from "./i-accessor-formatter";
import {GetAccessorDeclaration, SetAccessorDeclaration} from "typescript";
import {FormattedAccessor, FormattedExpressionKind} from "@wessberg/type";
import {AccessorBaseFormatter} from "../accessor-base/accessor-base-formatter";

/**
 * A class that can format GetAccessorDeclarations and SetAccessorDeclarations
 */
export class AccessorFormatter extends AccessorBaseFormatter implements IAccessorFormatter {

	/**
	 * Formats the given GetAccessorDeclaration|SetAccessorDeclaration into a FormattedAccessor
	 * @param {GetAccessorDeclaration|SetAccessorDeclaration} expression
	 * @returns {FormattedAccessor}
	 */
	public format (expression: GetAccessorDeclaration|SetAccessorDeclaration): FormattedAccessor {
		const result: FormattedAccessor = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.ACCESSOR
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}
}