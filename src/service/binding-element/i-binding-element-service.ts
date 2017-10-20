import {BindingElement} from "typescript";

export interface IBindingElementService {
	getName (bindingElement: BindingElement): string;
	getPropertyName (bindingElement: BindingElement): string|undefined;
	getInitializer (bindingElement: BindingElement): string|undefined;
	isRestSpread (bindingElement: BindingElement): boolean;
}