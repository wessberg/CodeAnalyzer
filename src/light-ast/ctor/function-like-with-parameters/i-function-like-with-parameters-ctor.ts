import {IFunctionLikeCtor} from "../function-like/i-function-like-ctor";
import {IParameterCtor} from "../parameter/i-parameter-ctor";

export interface IFunctionLikeWithParametersCtor extends IFunctionLikeCtor {
	parameters: IParameterCtor[]|null;
	typeParameters: string[]|null;
}