import {IParameterFormatter} from "./i-parameter-formatter";
import {ParameterDeclaration} from "typescript";
import {FormattedExpressionKind, FormattedParameter} from "@wessberg/type";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {ParameterTypeFormatterGetter} from "../../type/parameter-type-formatter/parameter-type-formatter-getter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class that can format parameters
 */
export class ParameterFormatter extends FormattedExpressionFormatter implements IParameterFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private expressionFormatter: ExpressionFormatterGetter,
							 private parameterTypeFormatter: ParameterTypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the given ParameterDeclaration into a FormattedParameter
	 * @param {ParameterDeclaration} expression
	 * @returns {FormattedParameter}
	 */
	public format (expression: ParameterDeclaration): FormattedParameter {

		const result: FormattedParameter = {
			...super.format(expression),
			...this.parameterTypeFormatter().format(expression),
			expressionKind: FormattedExpressionKind.PARAMETER,
			initializer: expression.initializer == null ? null : this.expressionFormatter().format(expression.initializer)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the FormattedParameter
	 * @param {FormattedParameter} formatted
	 * @returns {string}
	 */
	private stringify (formatted: FormattedParameter): string {
		// Use the parameter type stringifier
		let str = this.parameterTypeFormatter().stringify(formatted);

		// Add the initializer value if it has one
		if (formatted.initializer != null) {
			str += ` = ${formatted.initializer.toString()}`;
		}

		return str;
	}
}