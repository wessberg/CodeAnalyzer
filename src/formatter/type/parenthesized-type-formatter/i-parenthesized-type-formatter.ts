import {IFormattedParenthesizedType} from "@wessberg/type";
import {ParenthesizedTypeNode} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IParenthesizedTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: ParenthesizedTypeNode): IFormattedParenthesizedType;
}