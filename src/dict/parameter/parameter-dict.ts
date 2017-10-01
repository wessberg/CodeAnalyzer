import {ParameterKind} from "./parameter-kind";
import {DecoratorDict} from "../decorator/decorator-dict";
import {BindingNameDict, IArrayBindingNameDict, INormalBindingNameDict, IObjectBindingNameDict} from "../binding-name/binding-name-dict";
import {BindingName, Decorator} from "typescript";

export interface IParameterDict {
	kind: ParameterKind;
	type: string;
	initializer: string|null;
	isRestSpread: boolean;
	isOptional: boolean;
	decorators: Iterable<DecoratorDict|Decorator>|null;
	name: BindingNameDict|BindingName;
}

export interface INormalParameterDict extends IParameterDict {
	kind: ParameterKind.NORMAL;
	name: INormalBindingNameDict;
}

export interface IObjectBindingParameterDict extends IParameterDict {
	kind: ParameterKind.OBJECT_BINDING;
	name: IObjectBindingNameDict;
}

export interface IArrayBindingParameterDict extends IParameterDict {
	kind: ParameterKind.ARRAY_BINDING;
	name: IArrayBindingNameDict;
}

export declare type ParameterDict = INormalParameterDict|IObjectBindingParameterDict|IArrayBindingParameterDict;