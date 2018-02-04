import {AccessorKind} from "../../dict/accessor/accessor-kind";
import {IFunctionLikeCtor} from "../function-like/i-function-like-ctor";
import {IDecoratorCtor} from "../decorator/i-decorator-ctor";
import {IParameterCtor} from "../parameter/i-parameter-ctor";

export interface IAccessorCtor {
	kind: AccessorKind;
	name: string;
}

export interface IGetAccessorCtor extends IAccessorCtor, IFunctionLikeCtor {
	kind: "GET";
}

export interface ISetAccessorCtor extends IAccessorCtor {
	kind: "SET";
	decorators: IDecoratorCtor[]|null;
	body: string|null;
	parameters: IParameterCtor[]|null;
}

export declare type AccessorCtor = IGetAccessorCtor|ISetAccessorCtor;