import {IPojoType} from "@wessberg/type";
import {IPojoTypeFormatterFormatOptions} from "./i-pojo-type-formatter-format-options";

export interface IPojoTypeFormatter {
	format ({node}: IPojoTypeFormatterFormatOptions): IPojoType;
}