import {IStringEnumerationType} from "@wessberg/type";
import {IStringEnumerationTypeFormatterFormatOptions} from "./i-string-enumeration-type-formatter-format-options";

export interface IStringEnumerationTypeFormatter {
	format ({node}: IStringEnumerationTypeFormatterFormatOptions): IStringEnumerationType;
}