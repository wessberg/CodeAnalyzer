import {BooleanLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedBooleanLiteral} from "./i-formatted-boolean-literal";

export interface IBooleanLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: BooleanLiteral): IFormattedBooleanLiteral;
}