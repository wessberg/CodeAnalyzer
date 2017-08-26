import {IFormattedExpression} from "../../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedNumberLiteral extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.NUMBER_LITERAL;
	value: number;
}