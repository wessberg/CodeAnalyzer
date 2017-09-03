import {IFormattedStringEnumerationType} from "@wessberg/type";
import {StringLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IStringEnumerationTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: StringLiteral): IFormattedStringEnumerationType;
}