import {ITypeElementCtor} from "../type-element/i-type-element-ctor";

export interface IPropertySignatureCtor extends ITypeElementCtor {
	type: string|null|undefined;
	initializer: string|null|undefined;
	isReadonly: boolean;
}