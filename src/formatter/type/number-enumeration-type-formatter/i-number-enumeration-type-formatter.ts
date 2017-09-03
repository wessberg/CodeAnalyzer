import {IFormattedNumberEnumerationType} from "@wessberg/type";
import {NumericLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface INumberEnumerationTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: NumericLiteral): IFormattedNumberEnumerationType;
}