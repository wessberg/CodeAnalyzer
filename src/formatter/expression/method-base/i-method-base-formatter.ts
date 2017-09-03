import {MethodDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedMethodBase} from "@wessberg/type";

export interface IMethodBaseFormatter extends IFormattedExpressionFormatter {
	format (expression: MethodDeclaration): IFormattedMethodBase;
}