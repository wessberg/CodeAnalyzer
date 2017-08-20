import {IReferenceType} from "@wessberg/type";
import {IReferenceTypeFormatterFormatOptions} from "./i-reference-type-formatter-format-options";

export interface IReferenceTypeFormatter {
	format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IReferenceTypeFormatterFormatOptions): IReferenceType;
}