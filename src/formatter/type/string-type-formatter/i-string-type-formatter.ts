import {IFormattedStringType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IStringTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.StringKeyword>): IFormattedStringType;
}