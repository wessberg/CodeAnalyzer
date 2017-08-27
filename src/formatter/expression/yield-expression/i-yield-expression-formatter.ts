import {YieldExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedYieldExpression} from "@wessberg/type";

export interface IYieldExpressionFormatter extends IFormattedExpressionFormatter {
	format (expression: YieldExpression): IFormattedYieldExpression;
}