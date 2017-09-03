import {IFormattedNumberType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";

export interface INumberTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.NumberKeyword>): IFormattedNumberType;
}