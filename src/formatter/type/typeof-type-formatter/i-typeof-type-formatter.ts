import {ITypeofType} from "@wessberg/type";
import {ITypeofTypeFormatterFormatOptions} from "./i-typeof-type-formatter-format-options";

export interface ITypeofTypeFormatter {
	format ({node}: ITypeofTypeFormatterFormatOptions): ITypeofType;
}