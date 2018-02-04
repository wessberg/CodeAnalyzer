import {IClassAccessorCtor} from "../../ctor/class-accessor/class-accessor-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IFunctionLikeDict} from "../function-like/i-function-like-dict";
import {IDecoratorDict} from "../decorator/i-decorator-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface IClassAccessorDict extends IClassAccessorCtor, INodeDict {
	nodeKind: "CLASS_ACCESSOR";
}

export interface IClassGetAccessorDict extends IClassAccessorDict, IFunctionLikeDict, INodeDict {
	kind: "GET";
	nodeKind: "CLASS_ACCESSOR";
}

export interface IClassSetAccessorDict extends IClassAccessorDict, INodeDict {
	kind: "SET";
	nodeKind: "CLASS_ACCESSOR";
	decorators: IDecoratorDict[]|null;
	body: string|null;
	parameters: IParameterDict[]|null;
}

export declare type ClassAccessorDict = IClassGetAccessorDict|IClassSetAccessorDict;