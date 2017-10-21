import {IArrayBindingNameCtor, IBindingNameCtor, INormalBindingNameCtor, IObjectBindingNameCtor} from "../../ctor/binding-name/binding-name-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IBindingNameDict extends IBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
}

export interface INormalBindingNameDict extends INormalBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
}

export interface IObjectBindingNameDict extends IObjectBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
}

export interface IArrayBindingNameDict extends IArrayBindingNameCtor, INodeDict {
	nodeKind: "BINDING_NAME";
}

export declare type BindingNameDict = INormalBindingNameDict|IArrayBindingNameDict|IObjectBindingNameDict;