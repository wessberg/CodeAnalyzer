import {ConstructorDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedClassConstructor} from "@wessberg/type";

export interface IClassConstructorFormatter extends IFormattedExpressionFormatter {
	format (expression: ConstructorDeclaration): IFormattedClassConstructor;
}