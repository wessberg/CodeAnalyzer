import {ArrayBindingElement, OmittedExpression} from "typescript";
import {ArrayBindingName} from "@wessberg/type";

export interface IArrayBindingNameFormatter {
	format (bindingElement: ArrayBindingElement|OmittedExpression, index: number): ArrayBindingName;
}