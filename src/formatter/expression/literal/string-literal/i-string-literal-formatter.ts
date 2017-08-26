import {StringLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedStringLiteral} from "./i-formatted-string-literal";

export interface IStringLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: StringLiteral): IFormattedStringLiteral;
}