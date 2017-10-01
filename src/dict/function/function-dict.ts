import {FunctionKind} from "./function-kind";
import {IFunctionLikeWithParametersDict} from "../function-like-with-parameters/i-function-like-with-parameters-dict";

export interface IFunctionDict extends IFunctionLikeWithParametersDict {
	kind: FunctionKind;
}

export interface INormalFunctionDict extends IFunctionDict {
	kind: FunctionKind.NORMAL;
	name: string;
}

export interface IArrowFunctionDict extends IFunctionDict {
	kind: FunctionKind.ARROW;
	name: string;
}

export declare type FunctionDict = INormalFunctionDict|IArrowFunctionDict;