import {SuperExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedSuperExpression} from "@wessberg/type";

export interface ISuperExpressionFormatter extends IFormattedExpressionFormatter {
	format (expression: SuperExpression): IFormattedSuperExpression;
}