import {PropertyName} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {FormattedPropertyName} from "@wessberg/type";

export interface IPropertyNameFormatter extends IFormattedExpressionFormatter {
	format (expression: PropertyName): FormattedPropertyName;
}