import {ClassDeclaration, ClassExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedClass} from "@wessberg/type";

export interface IClassFormatter extends IFormattedExpressionFormatter {
	format (expression: ClassDeclaration|ClassExpression): IFormattedClass;
}