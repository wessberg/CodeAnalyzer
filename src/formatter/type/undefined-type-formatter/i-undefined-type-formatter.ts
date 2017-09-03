import {IFormattedUndefinedType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IUndefinedTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.UndefinedKeyword>): IFormattedUndefinedType;
}