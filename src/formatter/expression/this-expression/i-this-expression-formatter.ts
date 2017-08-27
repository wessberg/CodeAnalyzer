import {ThisExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedThisExpression} from "@wessberg/type";

export interface IThisExpressionFormatter extends IFormattedExpressionFormatter {
	format (expression: ThisExpression): IFormattedThisExpression;
}