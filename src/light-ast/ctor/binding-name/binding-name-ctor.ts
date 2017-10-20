import {IObjectBindingElementCtor} from "../binding-element/i-object-binding-element-ctor";
import {ArrayBindingElementCtor} from "../binding-element/array-binding-element-ctor";
import {BindingNameKind} from "../../dict/binding-name/binding-name-kind";

export interface IBindingNameCtor {
	kind: BindingNameKind;
}

export interface INormalBindingNameCtor extends IBindingNameCtor {
	kind: BindingNameKind.NORMAL;
	name: string;
}

export interface IObjectBindingNameCtor extends IBindingNameCtor {
	kind: BindingNameKind.OBJECT_BINDING;
	elements: IObjectBindingElementCtor[];
}

export interface IArrayBindingNameCtor extends IBindingNameCtor {
	kind: BindingNameKind.ARRAY_BINDING;
	elements: ArrayBindingElementCtor[];
}

export declare type BindingNameCtor = INormalBindingNameCtor|IArrayBindingNameCtor|IObjectBindingNameCtor;