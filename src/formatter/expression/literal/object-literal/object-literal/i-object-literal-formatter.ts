import {ObjectLiteralExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedObjectLiteral} from "@wessberg/type";

export interface IObjectLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: ObjectLiteralExpression): IFormattedObjectLiteral;
}