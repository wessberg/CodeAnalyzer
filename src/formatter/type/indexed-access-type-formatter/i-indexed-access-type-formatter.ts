import {IFormattedIndexedAccessType} from "@wessberg/type";
import {IndexedAccessTypeNode} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IIndexedAccessTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: IndexedAccessTypeNode): IFormattedIndexedAccessType;
}