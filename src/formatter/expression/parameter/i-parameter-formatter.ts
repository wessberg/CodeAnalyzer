import {ParameterDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {FormattedParameter} from "@wessberg/type";

export interface IParameterFormatter extends IFormattedExpressionFormatter {
	format (expression: ParameterDeclaration): FormattedParameter;
}