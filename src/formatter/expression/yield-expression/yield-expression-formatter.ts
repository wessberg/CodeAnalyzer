import {YieldExpression} from "typescript";
import {IYieldExpressionFormatter} from "./i-yield-expression-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedYieldExpression} from "@wessberg/type";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";

/**
 * A class that can format await expressions
 */
export class YieldExpressionFormatter extends FormattedExpressionFormatter implements IYieldExpressionFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given YieldExpression into an IFormattedYieldExpression
	 * @param {YieldExpression} expression
	 * @returns {IFormattedYieldExpression}
	 */
	public format (expression: YieldExpression): IFormattedYieldExpression {

		const result: IFormattedYieldExpression = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.YIELD_EXPRESSION,
			expression: expression.expression == null ? null : this.expressionFormatter().format(expression.expression)
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedYieldExpression
	 * @param {IFormattedYieldExpression} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedYieldExpression): string {
		let str = "yield";
		if (formatted.expression != null) str += ` ${formatted.expression.toString()}`;
		return str;
	}

}