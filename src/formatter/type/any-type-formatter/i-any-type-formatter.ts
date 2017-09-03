import {IFormattedAnyType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";

export interface IAnyTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.AnyKeyword>): IFormattedAnyType;
}