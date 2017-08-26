import {IFormattedExpression} from "../../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedStringLiteral extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.STRING_LITERAL;
	value: string;
}