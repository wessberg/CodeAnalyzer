import {IArrayBindingNameCtor, IBindingNameCtor, INormalBindingNameCtor, IObjectBindingNameCtor} from "../../ctor/binding-name/binding-name-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IObjectBindingElementDict} from "../binding-element/i-object-binding-element-dict";
import {ArrayBindingElementDict} from "../binding-element/array-binding-element-dict";

export interface IBindingNameDict extends IBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
}

export interface INormalBindingNameDict extends INormalBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
}

export interface IObjectBindingNameDict extends IObjectBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
	elements: IObjectBindingElementDict[];
}

export interface IArrayBindingNameDict extends IArrayBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
	elements: ArrayBindingElementDict[];
}

export declare type BindingNameDict = INormalBindingNameDict|IArrayBindingNameDict|IObjectBindingNameDict;