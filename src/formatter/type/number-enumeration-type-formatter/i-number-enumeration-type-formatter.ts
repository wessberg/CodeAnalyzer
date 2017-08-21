import {INumberEnumerationType} from "@wessberg/type";
import {INumberEnumerationTypeFormatterFormatOptions} from "./i-number-enumeration-type-formatter-format-options";

export interface INumberEnumerationTypeFormatter {
	format ({node}: INumberEnumerationTypeFormatterFormatOptions): INumberEnumerationType;
}