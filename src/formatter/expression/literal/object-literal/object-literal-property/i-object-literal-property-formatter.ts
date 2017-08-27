import {ObjectLiteralElementLike} from "typescript";
import {IFormattedExpressionFormatter} from "../../../formatted-expression/i-formatted-expression-formatter";
import {FormattedObjectLiteralProperty} from "@wessberg/type";

export interface IObjectLiteralPropertyFormatter extends IFormattedExpressionFormatter {
	format (expression: ObjectLiteralElementLike): FormattedObjectLiteralProperty;
}