import {ClassElement} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedClassElement} from "@wessberg/type";

export interface IClassElementFormatter extends IFormattedExpressionFormatter {
	format (expression: ClassElement): IFormattedClassElement;
}