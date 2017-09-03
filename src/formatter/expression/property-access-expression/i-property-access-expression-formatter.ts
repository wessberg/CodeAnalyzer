import {PropertyAccessExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedPropertyAccessExpression} from "@wessberg/type";

export interface IPropertyAccessExpressionFormatter extends IFormattedExpressionFormatter {
	format (expression: PropertyAccessExpression): IFormattedPropertyAccessExpression;
}