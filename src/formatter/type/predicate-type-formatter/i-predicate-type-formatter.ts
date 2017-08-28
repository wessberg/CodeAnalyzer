import {IPredicateType} from "@wessberg/type";
import {IPredicateTypeFormatterOptions} from "./i-predicate-type-formatter-options";

export interface IPredicateTypeFormatter {
	format ({node}: IPredicateTypeFormatterOptions): IPredicateType;
}