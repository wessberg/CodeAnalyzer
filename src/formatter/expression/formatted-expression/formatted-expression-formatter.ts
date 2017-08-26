import {IFormattedExpressionFormatter} from "./i-formatted-expression-formatter";
import {Expression} from "typescript";
import {IFormattedExpression} from "./i-formatted-expression";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";

/**
 * A class that can format any kind of expression
 */
export abstract class FormattedExpressionFormatter implements IFormattedExpressionFormatter {

	/**
	 * Formats the given expression into an IFormattedExpression
	 * @param {Expression} expression
	 * @returns {IFormattedExpression}
	 */
	public format (expression: Expression): IFormattedExpression {
		return {
			file: expression.getSourceFile().fileName,
			expressionKind: FormattedExpressionKind.EXPRESSION,
			startsAt: expression.pos,
			endsAt: expression.end
		};
	}
}