import {ITupleType} from "@wessberg/type";
import {ITupleTypeFormatterFormatOptions} from "./i-tuple-type-formatter-format-options";

export interface ITupleTypeFormatter {
	format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: ITupleTypeFormatterFormatOptions): ITupleType;
}