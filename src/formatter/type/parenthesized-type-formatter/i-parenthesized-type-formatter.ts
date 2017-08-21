import {IParenthesizedType} from "@wessberg/type";
import {IParenthesizedTypeFormatterFormatOptions} from "./i-parenthesized-type-formatter-format-options";

export interface IParenthesizedTypeFormatter {
	format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IParenthesizedTypeFormatterFormatOptions): IParenthesizedType;
}