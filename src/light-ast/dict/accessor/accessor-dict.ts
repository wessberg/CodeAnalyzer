import {IAccessorCtor, IGetAccessorCtor, ISetAccessorCtor} from "../../ctor/accessor/accessor-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IAccessorDict extends IAccessorCtor, INodeDict {
	nodeKind: NodeKind.ACCESSOR;
}

export interface IGetAccessorDict extends IGetAccessorCtor, INodeDict {
	nodeKind: NodeKind.ACCESSOR;
}

export interface ISetAccessorDict extends ISetAccessorCtor, INodeDict {
	nodeKind: NodeKind.ACCESSOR;
}

export declare type AccessorDict = IGetAccessorDict|ISetAccessorDict;