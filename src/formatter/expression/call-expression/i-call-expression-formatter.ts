import {IFormattedCallExpression} from "./i-formatted-call-expression";
import {CallExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";

export interface ICallExpressionFormatter extends IFormattedExpressionFormatter {
	format (expression: CallExpression): IFormattedCallExpression;
}