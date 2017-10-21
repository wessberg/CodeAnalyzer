import {ITypeElementCtor} from "../type-element/i-type-element-ctor";

export interface IPropertySignatureCtor extends ITypeElementCtor {
	type: string|null;
	initializer: string|null;
	isReadonly: boolean;
}