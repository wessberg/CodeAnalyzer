import {IFunctionLikeDict} from "../function-like/i-function-like-dict";
import {AccessorKind} from "../accessor/accessor-kind";
import {IAccessorDict} from "../accessor/accessor-dict";
import {VisibilityKind} from "../visibility/visibility-kind";
import {DecoratorDict} from "../decorator/decorator-dict";
import {Decorator, ParameterDeclaration} from "typescript";
import {ParameterDict} from "../parameter/parameter-dict";

export interface IClassAccessorDict extends IAccessorDict {
	isStatic: boolean;
	isAbstract: boolean;
	visibility: VisibilityKind;
}

export interface IClassGetAccessorDict extends IClassAccessorDict, IFunctionLikeDict {
	kind: AccessorKind.GET;
}

export interface IClassSetAccessorDict extends IClassAccessorDict {
	kind: AccessorKind.SET;
	decorators: Iterable<DecoratorDict|Decorator>|null;
	body: string|null;
	parameters: Iterable<ParameterDict|ParameterDeclaration>|null;
}

export declare type ClassAccessorDict = IClassGetAccessorDict|IClassSetAccessorDict;