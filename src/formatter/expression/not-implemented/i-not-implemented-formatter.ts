import {Expression, ExpressionWithTypeArguments} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedNotImplemented} from "@wessberg/type";

export interface INotImplementedFormatter extends IFormattedExpressionFormatter {
	format (expression: Expression|ExpressionWithTypeArguments): IFormattedNotImplemented;
}