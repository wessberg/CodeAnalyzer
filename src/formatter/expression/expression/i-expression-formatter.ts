import {Expression, ExpressionWithTypeArguments, Statement} from "typescript";
import {FormattedExpression} from "@wessberg/type";

export interface IExpressionFormatter {
	format (expression: Expression|ExpressionWithTypeArguments|Statement): FormattedExpression;
}