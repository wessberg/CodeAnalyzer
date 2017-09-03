import {IFormattedThisType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IThisTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.ThisKeyword>): IFormattedThisType;
}