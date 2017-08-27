import {IFormattedExpression} from "../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedIdentifier extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.IDENTIFIER;
	name: string;
}