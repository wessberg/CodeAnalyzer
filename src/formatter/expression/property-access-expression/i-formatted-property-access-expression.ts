import {FormattedExpression, IFormattedExpression} from "../formatted-expression/i-formatted-expression";
import {FormattedExpressionKind} from "../formatted-expression-kind/formatted-expression-kind";

export interface IFormattedPropertyAccessExpression extends IFormattedExpression {
	expressionKind: FormattedExpressionKind.PROPERTY_ACCESS;
	expression: FormattedExpression;
	property: string;
}