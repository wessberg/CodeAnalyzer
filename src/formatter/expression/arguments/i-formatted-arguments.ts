import {IFormattedExpression} from "../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedArguments extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.ARGUMENTS;
	arguments: IFormattedExpression[];
}