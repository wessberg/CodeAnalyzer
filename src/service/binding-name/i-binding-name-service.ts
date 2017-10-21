import {BindingName} from "typescript";

export interface IBindingNameService {
	getName (bindingName: BindingName): string;
}