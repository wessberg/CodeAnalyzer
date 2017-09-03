import {IFormattedTupleType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {TupleTypeNode} from "typescript";

export interface ITupleTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: TupleTypeNode): IFormattedTupleType;
}