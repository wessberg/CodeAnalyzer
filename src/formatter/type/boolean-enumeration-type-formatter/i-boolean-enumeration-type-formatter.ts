import {IFormattedBooleanEnumerationType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {BooleanLiteral} from "typescript";

export interface IBooleanEnumerationTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: BooleanLiteral): IFormattedBooleanEnumerationType;
}