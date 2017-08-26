import {CallExpression} from "typescript";
import {IFormattedArguments} from "./i-formatted-arguments";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";

export interface IArgumentsFormatter extends IFormattedExpressionFormatter {
	format (expression: CallExpression): IFormattedArguments;
}