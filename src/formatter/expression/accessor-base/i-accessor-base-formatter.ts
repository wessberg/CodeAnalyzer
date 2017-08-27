import {GetAccessorDeclaration, SetAccessorDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {FormattedAccessorBase} from "@wessberg/type";

export interface IAccessorBaseFormatter extends IFormattedExpressionFormatter {
	format (expression: GetAccessorDeclaration|SetAccessorDeclaration): FormattedAccessorBase;
}