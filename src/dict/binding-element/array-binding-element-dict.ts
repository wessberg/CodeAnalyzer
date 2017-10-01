import {ArrayBindingElementKind} from "./array-binding-element-kind";

export interface IOmittedArrayBindingElementDict {
	kind: ArrayBindingElementKind.OMITTED;
}

export interface INormalArrayBindingElementDict {
	kind: ArrayBindingElementKind.NORMAL;
	name: string;
	isRestSpread: boolean;
	initializer: string|null;
}

export declare type ArrayBindingElementDict = IOmittedArrayBindingElementDict|INormalArrayBindingElementDict;