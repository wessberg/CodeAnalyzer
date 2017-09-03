import {IFormattedBooleanType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";

export interface IBooleanTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.BooleanKeyword>): IFormattedBooleanType;
}