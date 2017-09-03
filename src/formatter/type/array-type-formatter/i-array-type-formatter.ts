import {IFormattedArrayType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {ArrayTypeNode} from "typescript";

export interface IArrayTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: ArrayTypeNode): IFormattedArrayType;
}