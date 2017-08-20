import {IIndexType} from "@wessberg/type";
import {IIndexTypeFormatterFormatOptions} from "./i-index-type-formatter-format-options";

export interface IIndexTypeFormatter {
	format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IIndexTypeFormatterFormatOptions): IIndexType;
}