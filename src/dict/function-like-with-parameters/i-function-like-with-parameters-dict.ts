import {ParameterDict} from "../parameter/parameter-dict";
import {IFunctionLikeDict} from "../function-like/i-function-like-dict";

export interface IFunctionLikeWithParametersDict extends IFunctionLikeDict {
	parameters: Iterable<ParameterDict>|null;
	typeParameters: Iterable<string>|null;
}