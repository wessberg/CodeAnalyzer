import {AccessorKind} from "../../dict/accessor/accessor-kind";
import {IFunctionLikeCtor} from "../function-like/i-function-like-ctor";
import {IDecoratorCtor} from "../decorator/i-decorator-ctor";
import {IParameterCtor} from "../parameter/i-parameter-ctor";

export interface IAccessorCtor {
	kind: AccessorKind;
	name: string;
}

export interface IGetAccessorCtor extends IAccessorCtor, IFunctionLikeCtor {
	kind: AccessorKind.GET;
}

export interface ISetAccessorCtor extends IAccessorCtor {
	kind: AccessorKind.SET;
	decorators: Iterable<IDecoratorCtor>|null;
	body: string|null;
	parameters: Iterable<IParameterCtor>|null;
}

export declare type AccessorCtor = IGetAccessorCtor|ISetAccessorCtor;