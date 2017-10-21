import {BindingPattern} from "typescript";

export interface IBindingPatternService {
	getText (bindingPattern: BindingPattern): string;
}