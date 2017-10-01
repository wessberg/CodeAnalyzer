import {IFunctionLikeDict} from "../function-like/i-function-like-dict";
import {IFunctionLikeWithParametersDict} from "../function-like-with-parameters/i-function-like-with-parameters-dict";
import {AccessorKind} from "../accessor/accessor-kind";
import {IAccessorDict} from "../accessor/accessor-dict";
import {VisibilityKind} from "../visibility/visibility-kind";

export interface IClassAccessorDict extends IAccessorDict {
	isStatic: boolean;
	isAbstract: boolean;
	visibility: VisibilityKind;
}

export interface IClassGetAccessorDict extends IClassAccessorDict, IFunctionLikeDict {
	kind: AccessorKind.GET;
}

export interface IClassSetAccessorDict extends IClassAccessorDict, IFunctionLikeWithParametersDict {
	kind: AccessorKind.SET;
}

export declare type ClassAccessorDict = IClassGetAccessorDict|IClassSetAccessorDict;