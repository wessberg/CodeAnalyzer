import {IFunctionLikeWithParametersCtor} from "../function-like-with-parameters/i-function-like-with-parameters-ctor";
import {FunctionKind} from "../../dict/function/function-kind";

export interface IFunctionCtor extends IFunctionLikeWithParametersCtor {
	kind: FunctionKind;
}

export interface INormalFunctionCtor extends IFunctionCtor {
	kind: FunctionKind.NORMAL;
	name: string;
}

export interface IArrowFunctionCtor extends IFunctionCtor {
	kind: FunctionKind.ARROW;
	name: string;
}

export declare type FunctionCtor = INormalFunctionCtor|IArrowFunctionCtor;