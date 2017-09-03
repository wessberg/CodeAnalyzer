import {IFormattedUnionType} from "@wessberg/type";
import {UnionTypeNode} from "typescript";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IUnionTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: UnionTypeNode): IFormattedUnionType;
}