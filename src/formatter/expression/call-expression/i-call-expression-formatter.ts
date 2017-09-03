import {CallExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedCallExpression} from "@wessberg/type";

export interface ICallExpressionFormatter extends IFormattedExpressionFormatter {
	format (expression: CallExpression): IFormattedCallExpression;
}