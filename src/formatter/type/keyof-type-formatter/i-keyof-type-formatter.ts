import {IKeyofType} from "@wessberg/type";
import {IKeyofTypeFormatterFormatOptions} from "./i-keyof-type-formatter-format-options";

export interface IKeyofTypeFormatter {
	format ({node}: IKeyofTypeFormatterFormatOptions): IKeyofType;
}