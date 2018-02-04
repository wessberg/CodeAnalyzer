import {INodeDict} from "../node/i-node-dict";
import {FunctionKind} from "./function-kind";
import {IFunctionLikeWithParametersDict} from "../function-like-with-parameters/i-function-like-with-parameters-dict";

export interface IFunctionDict extends IFunctionLikeWithParametersDict, INodeDict {
	nodeKind: "FUNCTION";
	kind: FunctionKind;
	isAsync: boolean;
}

export interface INormalFunctionDict extends IFunctionDict, INodeDict {
	nodeKind: "FUNCTION";
	kind: "NORMAL";
	name: string;
}

export interface IArrowFunctionDict extends IFunctionDict, INodeDict {
	nodeKind: "FUNCTION";
	kind: "ARROW";
	name: string;
}

export declare type FunctionDict = INormalFunctionDict|IArrowFunctionDict;