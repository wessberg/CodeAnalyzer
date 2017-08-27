import {Declaration, Expression, Statement, Node} from "typescript";
import {IFormattedExpression} from "@wessberg/type";

export interface IFormattedExpressionFormatter {
	format (expression: Statement|Expression|Declaration|Node): IFormattedExpression;
}