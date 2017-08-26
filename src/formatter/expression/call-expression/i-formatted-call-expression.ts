import {FormattedExpression, IFormattedExpression} from "../formatted-expression/i-formatted-expression";
import {Type} from "@wessberg/type";
import {IFormattedArguments} from "../arguments/i-formatted-arguments";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedCallExpression extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.CALL_EXPRESSION;
	typeArguments: Type[];
	arguments: IFormattedArguments;
	expression: FormattedExpression;
}