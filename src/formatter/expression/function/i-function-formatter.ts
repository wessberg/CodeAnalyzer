import {ArrowFunction, FunctionDeclaration, FunctionExpression} from "typescript";
import {FormattedFunction} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";

export interface IFunctionFormatter extends IFormattedExpressionFormatter {
	format (expression: FunctionDeclaration|FunctionExpression|ArrowFunction): FormattedFunction;
}