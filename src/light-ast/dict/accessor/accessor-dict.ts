import {IAccessorCtor, IGetAccessorCtor, ISetAccessorCtor} from "../../ctor/accessor/accessor-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IAccessorDict extends IAccessorCtor, INodeDict {
	nodeKind: "ACCESSOR";
}

export interface IGetAccessorDict extends IGetAccessorCtor, INodeDict {
	nodeKind: "ACCESSOR";
}

export interface ISetAccessorDict extends ISetAccessorCtor, INodeDict {
	nodeKind: "ACCESSOR";
}

export declare type AccessorDict = IGetAccessorDict|ISetAccessorDict;