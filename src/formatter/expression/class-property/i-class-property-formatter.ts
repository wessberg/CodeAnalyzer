import {PropertyDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedClassProperty} from "@wessberg/type";

export interface IClassPropertyFormatter extends IFormattedExpressionFormatter {
	format (expression: PropertyDeclaration): IFormattedClassProperty;
}