import {IFunctionLikeCtor} from "../function-like/i-function-like-ctor";
import {IAccessorCtor} from "../accessor/accessor-ctor";
import {IDecoratorCtor} from "../decorator/i-decorator-ctor";
import {IParameterCtor} from "../parameter/i-parameter-ctor";
import {VisibilityKind} from "../../dict/visibility/visibility-kind";
import {AccessorKind} from "../../dict/accessor/accessor-kind";

export interface IClassAccessorCtor extends IAccessorCtor {
	isStatic: boolean;
	isAbstract: boolean;
	visibility: VisibilityKind;
}

export interface IClassGetAccessorCtor extends IClassAccessorCtor, IFunctionLikeCtor {
	kind: AccessorKind.GET;
}

export interface IClassSetAccessorCtor extends IClassAccessorCtor {
	kind: AccessorKind.SET;
	decorators: Iterable<IDecoratorCtor>|null;
	body: string|null;
	parameters: Iterable<IParameterCtor>|null;
}

export declare type ClassAccessorCtor = IClassGetAccessorCtor|IClassSetAccessorCtor;