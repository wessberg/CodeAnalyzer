import {IClassAccessorCtor, IClassGetAccessorCtor, IClassSetAccessorCtor} from "../../ctor/class-accessor/class-accessor-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IClassAccessorDict extends IClassAccessorCtor, INodeDict {
	nodeKind: "CLASS_ACCESSOR";
}

export interface IClassGetAccessorDict extends IClassGetAccessorCtor, INodeDict {
	nodeKind: "CLASS_ACCESSOR";
}

export interface IClassSetAccessorDict extends IClassSetAccessorCtor, INodeDict {
	nodeKind: "CLASS_ACCESSOR";
}

export declare type ClassAccessorDict = IClassGetAccessorDict|IClassSetAccessorDict;