import {AwaitExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedAwaitExpression} from "@wessberg/type";

export interface IAwaitExpressionFormatter extends IFormattedExpressionFormatter {
	format (expression: AwaitExpression): IFormattedAwaitExpression;
}