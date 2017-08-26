import {IArrayType} from "@wessberg/type";
import {IArrayTypeFormatterFormatOptions} from "./i-array-type-formatter-format-options";

export interface IArrayTypeFormatter {
	format ({node}: IArrayTypeFormatterFormatOptions): IArrayType;
}