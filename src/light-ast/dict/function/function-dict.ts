import {IArrowFunctionCtor, IFunctionCtor, INormalFunctionCtor} from "../../ctor/function/function-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IFunctionDict extends IFunctionCtor, INodeDict {
	nodeKind: "FUNCTION";
}

export interface INormalFunctionDict extends INormalFunctionCtor, INodeDict {
	nodeKind: "FUNCTION";
}

export interface IArrowFunctionDict extends IArrowFunctionCtor, INodeDict {
	nodeKind: "FUNCTION";
}

export declare type FunctionDict = INormalFunctionDict|IArrowFunctionDict;