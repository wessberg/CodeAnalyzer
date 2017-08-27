import {IFormattedExpressionFormatter} from "./i-formatted-expression-formatter";
import {Declaration, Expression, Node, Statement} from "typescript";
import {FormattedExpressionKind, IFormattedExpression} from "@wessberg/type";

/**
 * A class that can format any kind of expression
 */
export abstract class FormattedExpressionFormatter implements IFormattedExpressionFormatter {

	/**
	 * Formats the given expression into an IFormattedExpression
	 * @param {Statement|Expression|Declaration|Node} expression
	 * @returns {IFormattedExpression}
	 */
	public format (expression: Statement|Expression|Declaration|Node): IFormattedExpression {
		return {
			// file: expression.getSourceFile().fileName,
			expressionKind: FormattedExpressionKind.EXPRESSION,
			startsAt: expression.pos,
			endsAt: expression.end
		};
	}
}