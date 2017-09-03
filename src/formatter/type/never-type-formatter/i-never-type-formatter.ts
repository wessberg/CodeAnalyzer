import {IFormattedNeverType} from "@wessberg/type";
import {SyntaxKind, Token} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface INeverTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: Token<SyntaxKind.NeverKeyword>): IFormattedNeverType;
}