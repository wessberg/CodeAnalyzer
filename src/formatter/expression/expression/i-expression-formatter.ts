import {Expression} from "typescript";
import {FormattedExpression} from "../formatted-expression/i-formatted-expression";

export interface IExpressionFormatter {
	format (expression: Expression): FormattedExpression;
}