import {NumericLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedNumberLiteral} from "@wessberg/type";

export interface INumberLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: NumericLiteral): IFormattedNumberLiteral;
}