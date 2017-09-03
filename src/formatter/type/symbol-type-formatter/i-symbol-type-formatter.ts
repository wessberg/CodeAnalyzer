import {IFormattedSymbolType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface ISymbolTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.SymbolKeyword>): IFormattedSymbolType;
}