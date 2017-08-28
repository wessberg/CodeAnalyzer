import {IIndexedAccessType} from "@wessberg/type";
import {IIndexedAccessTypeFormatterOptions} from "./i-indexed-access-type-formatter-options";

export interface IIndexedAccessTypeFormatter {
	format ({node}: IIndexedAccessTypeFormatterOptions): IIndexedAccessType;
}