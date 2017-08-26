import {IFunctionType} from "@wessberg/type";
import {IFunctionTypeFormatterFormatOptions} from "./i-function-type-formatter-format-options";

export interface IFunctionTypeFormatter {
	format ({node}: IFunctionTypeFormatterFormatOptions): IFunctionType;
}