import {IFormattedExpression} from "../../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedBooleanLiteral extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.BOOLEAN_LITERAL;
	value: boolean;
}