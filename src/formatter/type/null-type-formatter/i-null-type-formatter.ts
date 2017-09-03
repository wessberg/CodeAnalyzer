import {IFormattedNullType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface INullTypeFormatter extends IFormattedExpressionFormatter{
	format (expression: Token<SyntaxKind.NullKeyword>): IFormattedNullType;
}