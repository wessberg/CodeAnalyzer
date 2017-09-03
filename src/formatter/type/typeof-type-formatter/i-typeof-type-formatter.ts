import {IFormattedTypeofType} from "@wessberg/type";
import {TypeQueryNode} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface ITypeofTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: TypeQueryNode): IFormattedTypeofType;
}