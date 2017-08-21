import {IUnionType} from "@wessberg/type";
import {IUnionTypeFormatterFormatOptions} from "./i-union-type-formatter-format-options";

export interface IUnionTypeFormatter {
	format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IUnionTypeFormatterFormatOptions): IUnionType;
}