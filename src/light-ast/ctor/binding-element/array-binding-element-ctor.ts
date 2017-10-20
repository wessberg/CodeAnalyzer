import {ArrayBindingElementKind} from "../../dict/binding-element/array-binding-element-kind";

export interface IOmittedArrayBindingElementCtor {
	kind: ArrayBindingElementKind.OMITTED;
}

export interface INormalArrayBindingElementCtor {
	kind: ArrayBindingElementKind.NORMAL;
	name: string;
	isRestSpread: boolean;
	initializer: string|null|undefined;
}

export declare type ArrayBindingElementCtor = IOmittedArrayBindingElementCtor|INormalArrayBindingElementCtor;