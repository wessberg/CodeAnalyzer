import {BooleanLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedBooleanLiteral} from "@wessberg/type";

export interface IBooleanLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: BooleanLiteral): IFormattedBooleanLiteral;
}