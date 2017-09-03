import {CallExpression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedArguments} from "@wessberg/type";

export interface IArgumentsFormatter extends IFormattedExpressionFormatter {
	format (expression: CallExpression): IFormattedArguments;
}