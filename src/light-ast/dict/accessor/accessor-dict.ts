import {IAccessorCtor} from "../../ctor/accessor/accessor-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IFunctionLikeDict} from "../function-like/i-function-like-dict";
import {IDecoratorDict} from "../decorator/i-decorator-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface IAccessorDict extends IAccessorCtor, INodeDict {
	nodeKind: "ACCESSOR";
}

export interface IGetAccessorDict extends IAccessorDict, IFunctionLikeDict, INodeDict {
	nodeKind: "ACCESSOR";
}

export interface ISetAccessorDict extends IAccessorDict, INodeDict {
	nodeKind: "ACCESSOR";
	decorators: IDecoratorDict[]|null;
	body: string|null;
	parameters: IParameterDict[]|null;
}

export declare type AccessorDict = IGetAccessorDict|ISetAccessorDict;