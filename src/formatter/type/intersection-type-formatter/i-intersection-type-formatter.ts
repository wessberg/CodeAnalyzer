import {IIntersectionType} from "@wessberg/type";
import {IIntersectionTypeFormatterFormatOptions} from "./i-intersection-type-formatter-format-options";

export interface IIntersectionTypeFormatter {
	format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IIntersectionTypeFormatterFormatOptions): IIntersectionType;
}