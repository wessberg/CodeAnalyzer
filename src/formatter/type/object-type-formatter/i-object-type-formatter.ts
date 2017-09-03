import {IFormattedObjectType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IObjectTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.ObjectKeyword>): IFormattedObjectType;
}