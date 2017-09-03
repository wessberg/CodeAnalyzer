import {IFormattedVoidType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IVoidTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.VoidKeyword>): IFormattedVoidType;
}