import {IFormattedPredicateType} from "@wessberg/type";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";
import {TypePredicateNode} from "typescript";

export interface IPredicateTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: TypePredicateNode): IFormattedPredicateType;
}