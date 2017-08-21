import {IBooleanEnumerationType} from "@wessberg/type";
import {IBooleanEnumerationTypeFormatterFormatOptions} from "./i-boolean-enumeration-type-formatter-format-options";

export interface IBooleanEnumerationTypeFormatter {
	format ({node}: IBooleanEnumerationTypeFormatterFormatOptions): IBooleanEnumerationType;
}