import {IFunctionLikeWithParametersCtor} from "../function-like-with-parameters/i-function-like-with-parameters-ctor";
import {FunctionKind} from "../../dict/function/function-kind";

export interface IFunctionCtor extends IFunctionLikeWithParametersCtor {
	kind: FunctionKind;
	isAsync: boolean;
}

export interface INormalFunctionCtor extends IFunctionCtor {
	kind: "NORMAL";
	name: string;
}

export interface IArrowFunctionCtor extends IFunctionCtor {
	kind: "ARROW";
	name: string;
}

export declare type FunctionCtor = INormalFunctionCtor|IArrowFunctionCtor;