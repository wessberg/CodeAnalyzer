import {IFormattedPojoType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {TypeLiteralNode} from "typescript";

export interface IPojoTypeFormatter extends IFormattedExpressionFormatter {
	format (node: TypeLiteralNode): IFormattedPojoType;
}