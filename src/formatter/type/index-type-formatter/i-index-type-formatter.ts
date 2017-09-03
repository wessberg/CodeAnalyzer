import {IFormattedIndexType} from "@wessberg/type";
import {IndexSignatureDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IIndexTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: IndexSignatureDeclaration): IFormattedIndexType;
}