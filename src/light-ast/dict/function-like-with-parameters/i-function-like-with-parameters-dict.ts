import {IFunctionLikeWithParametersCtor} from "../../ctor/function-like-with-parameters/i-function-like-with-parameters-ctor";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface IFunctionLikeWithParametersDict extends IFunctionLikeWithParametersCtor {
	parameters: IParameterDict[]|null;
}