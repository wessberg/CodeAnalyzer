import {Expression} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedNotImplemented} from "./i-formatted-not-implemented";

export interface INotImplementedFormatter extends IFormattedExpressionFormatter {
	format (expression: Expression): IFormattedNotImplemented;
}