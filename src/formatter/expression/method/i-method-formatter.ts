import {MethodDeclaration} from "typescript";
import {IFormattedMethod} from "@wessberg/type";
import {IMethodBaseFormatter} from "../method-base/i-method-base-formatter";

export interface IMethodFormatter extends IMethodBaseFormatter {
	format (expression: MethodDeclaration): IFormattedMethod;
}