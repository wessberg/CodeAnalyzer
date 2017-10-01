import {IObjectBindingElementDict} from "../binding-element/i-object-binding-element-dict";
import {ArrayBindingElementDict} from "../binding-element/array-binding-element-dict";
import {BindingNameKind} from "./binding-name-kind";

export interface IBindingNameDict {
	kind: BindingNameKind;
}

export interface INormalBindingNameDict extends IBindingNameDict {
	kind: BindingNameKind.NORMAL;
	name: string;
}

export interface IObjectBindingNameDict extends IBindingNameDict {
	kind: BindingNameKind.OBJECT_BINDING;
	elements: IObjectBindingElementDict[];
}

export interface IArrayBindingNameDict extends IBindingNameDict {
	kind: BindingNameKind.ARRAY_BINDING;
	elements: ArrayBindingElementDict[];
}

export declare type BindingNameDict = INormalBindingNameDict|IArrayBindingNameDict|IObjectBindingNameDict;