import {NoSubstitutionTemplateLiteral, StringLiteral} from "typescript";
import {IFormattedExpressionFormatter} from "../../formatted-expression/i-formatted-expression-formatter";
import {IFormattedStringLiteral} from "@wessberg/type";

export interface IStringLiteralFormatter extends IFormattedExpressionFormatter {
	format (expression: StringLiteral|NoSubstitutionTemplateLiteral): IFormattedStringLiteral;
}