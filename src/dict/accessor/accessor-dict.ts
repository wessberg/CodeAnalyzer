import {AccessorKind} from "./accessor-kind";
import {IFunctionLikeDict} from "../function-like/i-function-like-dict";
import {ParameterDict} from "../parameter/parameter-dict";
import {DecoratorDict} from "../decorator/decorator-dict";

export interface IAccessorDict {
	kind: AccessorKind;
	name: string;
}

export interface IGetAccessorDict extends IAccessorDict, IFunctionLikeDict {
	kind: AccessorKind.GET;
}

export interface ISetAccessorDict extends IAccessorDict {
	kind: AccessorKind.SET;
	decorators: Iterable<DecoratorDict>|null;
	body: string|null;
	parameters: Iterable<ParameterDict>|null;
}

export declare type AccessorDict = IGetAccessorDict|ISetAccessorDict;