import {Expression, ExpressionWithTypeArguments} from "typescript";
import {FormattedExpression} from "@wessberg/type";

export interface IExpressionFormatter {
	format (expression: Expression|ExpressionWithTypeArguments): FormattedExpression;
}