import {ITupleType} from "@wessberg/type";
import {ITupleTypeFormatterFormatOptions} from "./i-tuple-type-formatter-format-options";

export interface ITupleTypeFormatter {
	format ({node}: ITupleTypeFormatterFormatOptions): ITupleType;
}