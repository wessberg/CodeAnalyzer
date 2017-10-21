export interface IOmittedArrayBindingElementCtor {
	kind: "OMITTED";
}

export interface INormalArrayBindingElementCtor {
	kind: "NORMAL";
	name: string;
	isRestSpread: boolean;
	initializer: string|null|undefined;
}

export declare type ArrayBindingElementCtor = IOmittedArrayBindingElementCtor|INormalArrayBindingElementCtor;