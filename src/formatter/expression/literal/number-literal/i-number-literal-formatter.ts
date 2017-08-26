import {NumericLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedNumberLiteral} from "./i-formatted-number-literal";

export interface INumberLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: NumericLiteral): IFormattedNumberLiteral;
}