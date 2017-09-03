import {IFormattedKeyofType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {TypeNode} from "typescript";

export interface IKeyofTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: TypeNode): IFormattedKeyofType;
}