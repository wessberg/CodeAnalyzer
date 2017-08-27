import {IMethodFormatter} from "./i-method-formatter";
import {MethodDeclaration} from "typescript";
import {FormattedExpressionKind, IFormattedMethod} from "@wessberg/type";
import {MethodBaseFormatter} from "../method-base/method-base-formatter";

/**
 * A class that can format MethodDeclarations
 */
export class MethodFormatter extends MethodBaseFormatter implements IMethodFormatter {

	/**
	 * Formats the given MethodDeclaration into a IFormattedMethod
	 * @param {MethodDeclaration} expression
	 * @returns {IFormattedMethod}
	 */
	public format (expression: MethodDeclaration): IFormattedMethod {
		const result: IFormattedMethod = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.METHOD
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}
}