import {IFormattedExpression} from "../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedNotImplemented extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.NOT_IMPLEMENTED;
	syntaxKind: string;
}