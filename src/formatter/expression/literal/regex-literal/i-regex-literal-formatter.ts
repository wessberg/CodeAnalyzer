import {RegularExpressionLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedRegexLiteral} from "@wessberg/type";

export interface IRegexLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: RegularExpressionLiteral): IFormattedRegexLiteral;
}