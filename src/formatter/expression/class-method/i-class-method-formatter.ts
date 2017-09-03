import {MethodDeclaration} from "typescript";
import {IFormattedClassMethod} from "@wessberg/type";
import {IMethodBaseFormatter} from "../method-base/i-method-base-formatter";

export interface IClassMethodFormatter extends IMethodBaseFormatter {
	format (expression: MethodDeclaration): IFormattedClassMethod;
}