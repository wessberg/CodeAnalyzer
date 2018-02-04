import {IFunctionLikeCtor} from "../function-like/i-function-like-ctor";
import {IAccessorCtor} from "../accessor/accessor-ctor";
import {IDecoratorCtor} from "../decorator/i-decorator-ctor";
import {IParameterCtor} from "../parameter/i-parameter-ctor";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";

export interface IClassAccessorCtor extends IAccessorCtor {
	isStatic: boolean;
	isAbstract: boolean;
	visibility: VisibilityKind;
}

export interface IClassGetAccessorCtor extends IClassAccessorCtor, IFunctionLikeCtor {
	kind: "GET";
}

export interface IClassSetAccessorCtor extends IClassAccessorCtor {
	kind: "SET";
	decorators: IDecoratorCtor[]|null;
	body: string|null;
	parameters: IParameterCtor[]|null;
}

export declare type ClassAccessorCtor = IClassGetAccessorCtor|IClassSetAccessorCtor;