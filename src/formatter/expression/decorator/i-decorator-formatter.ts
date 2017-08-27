import {Decorator} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedDecorator} from "@wessberg/type";

export interface IDecoratorFormatter extends IFormattedExpressionFormatter {
	format (expression: Decorator): IFormattedDecorator;
}