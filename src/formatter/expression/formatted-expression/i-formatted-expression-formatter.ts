import {Expression} from "typescript";
import {IFormattedExpression} from "./i-formatted-expression";

export interface IFormattedExpressionFormatter {
	format (expression: Expression): IFormattedExpression;
}