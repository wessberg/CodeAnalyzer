import {AwaitExpression} from "typescript";
import {IAwaitExpressionFormatter} from "./i-await-expression-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedAwaitExpression} from "@wessberg/type";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";

/**
 * A class that can format await expressions
 */
export class AwaitExpressionFormatter extends FormattedExpressionFormatter implements IAwaitExpressionFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given AwaitExpression into an IFormattedAwaitExpression
	 * @param {AwaitExpression} expression
	 * @returns {IFormattedAwaitExpression}
	 */
	public format (expression: AwaitExpression): IFormattedAwaitExpression {

		const result: IFormattedAwaitExpression = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.AWAIT_EXPRESSION,
			expression: this.expressionFormatter().format(expression.expression)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedAwaitExpression
	 * @param {IFormattedAwaitExpression} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedAwaitExpression): string {
		return `await ${formatted.expression.toString()}`;
	}

}