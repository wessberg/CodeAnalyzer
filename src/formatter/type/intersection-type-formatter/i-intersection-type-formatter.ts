import {IFormattedIntersectionType} from "@wessberg/type";
import {IntersectionTypeNode} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IIntersectionTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: IntersectionTypeNode): IFormattedIntersectionType;
}