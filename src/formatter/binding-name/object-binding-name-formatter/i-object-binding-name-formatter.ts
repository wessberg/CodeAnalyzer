import {BindingElement} from "typescript";
import {IObjectBindingName} from "@wessberg/type";

export interface IObjectBindingNameFormatter {
	format (bindingElement: BindingElement): IObjectBindingName;
}