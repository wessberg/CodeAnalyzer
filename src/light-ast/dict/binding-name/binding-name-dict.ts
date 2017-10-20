import {IArrayBindingNameCtor, IBindingNameCtor, INormalBindingNameCtor, IObjectBindingNameCtor} from "../../ctor/binding-name/binding-name-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IBindingNameDict extends IBindingNameCtor, INodeDict {
	nodeKind: NodeKind.BINDING_NAME;
}

export interface INormalBindingNameDict extends INormalBindingNameCtor, INodeDict {
	nodeKind: NodeKind.BINDING_NAME;
}

export interface IObjectBindingNameDict extends IObjectBindingNameCtor, INodeDict {
	nodeKind: NodeKind.BINDING_NAME;
}

export interface IArrayBindingNameDict extends IArrayBindingNameCtor, INodeDict {
	nodeKind: NodeKind.BINDING_NAME;
}

export declare type BindingNameDict = INormalBindingNameDict|IArrayBindingNameDict|IObjectBindingNameDict;