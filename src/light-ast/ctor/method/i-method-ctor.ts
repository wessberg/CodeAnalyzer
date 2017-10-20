import {IFunctionLikeWithParametersCtor} from "../function-like-with-parameters/i-function-like-with-parameters-ctor";

export interface IMethodCtor extends IFunctionLikeWithParametersCtor {
	name: string;
	isAsync: boolean;
}