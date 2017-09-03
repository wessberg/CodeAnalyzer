import {IFormattedPredicateType} from "@wessberg/type";
import {FirstTypeNode} from "../../../type/first-type-node/first-type-node";
import {IFormattedExpressionFormatter} from "../../expression/formatted-expression/i-formatted-expression-formatter";

export interface IPredicateTypeFormatter extends IFormattedExpressionFormatter {
	format (expression: FirstTypeNode): IFormattedPredicateType;
}