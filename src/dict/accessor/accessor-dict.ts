import {AccessorKind} from "./accessor-kind";
import {IFunctionLikeDict} from "../function-like/i-function-like-dict";
import {IFunctionLikeWithParametersDict} from "../function-like-with-parameters/i-function-like-with-parameters-dict";

export interface IAccessorDict {
	kind: AccessorKind;
	name: string;
}

export interface IGetAccessorDict extends IAccessorDict, IFunctionLikeDict {
	kind: AccessorKind.GET;
}

export interface ISetAccessorDict extends IAccessorDict, IFunctionLikeWithParametersDict {
	kind: AccessorKind.SET;
}

export declare type AccessorDict = IGetAccessorDict|ISetAccessorDict;