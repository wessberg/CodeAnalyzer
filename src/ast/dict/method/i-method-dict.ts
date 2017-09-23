import {IFunctionLikeWithParametersDict} from "../function-like-with-parameters/i-function-like-with-parameters-dict";

export interface IMethodDict extends IFunctionLikeWithParametersDict {
	name: string;
	isAsync: boolean;
}