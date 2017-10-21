import {INormalArrayBindingElementCtor, IOmittedArrayBindingElementCtor} from "../../ctor/binding-element/array-binding-element-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IOmittedArrayBindingElementDict extends IOmittedArrayBindingElementCtor, INodeDict {
	nodeKind: "ARRAY_BINDING_ELEMENT";
}

export interface INormalArrayBindingElementDict extends INormalArrayBindingElementCtor, INodeDict {
	nodeKind: "ARRAY_BINDING_ELEMENT";
}

export declare type ArrayBindingElementDict = IOmittedArrayBindingElementDict|INormalArrayBindingElementDict;