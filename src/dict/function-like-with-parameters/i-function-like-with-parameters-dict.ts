import {ParameterDict} from "../parameter/parameter-dict";
import {IFunctionLikeDict} from "../function-like/i-function-like-dict";
import {ParameterDeclaration} from "typescript";

export interface IFunctionLikeWithParametersDict extends IFunctionLikeDict {
	parameters: Iterable<ParameterDict|ParameterDeclaration>|null;
	typeParameters: Iterable<string>|null;
}