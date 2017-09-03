import {IFormattedFunctionType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {FunctionTypeNode, MethodSignature} from "typescript";

export interface IFunctionTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: MethodSignature|FunctionTypeNode): IFormattedFunctionType;
}