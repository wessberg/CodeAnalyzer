import {IArrowFunctionCtor, IFunctionCtor, INormalFunctionCtor} from "../../ctor/function/function-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IFunctionDict extends IFunctionCtor, INodeDict {
	nodeKind: NodeKind.FUNCTION;
}

export interface INormalFunctionDict extends INormalFunctionCtor, INodeDict {
	nodeKind: NodeKind.FUNCTION;
}

export interface IArrowFunctionDict extends IArrowFunctionCtor, INodeDict {
	nodeKind: NodeKind.FUNCTION;
}

export declare type FunctionDict = INormalFunctionDict|IArrowFunctionDict;