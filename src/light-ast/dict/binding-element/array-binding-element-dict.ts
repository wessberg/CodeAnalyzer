import {INormalArrayBindingElementCtor, IOmittedArrayBindingElementCtor} from "../../ctor/binding-element/array-binding-element-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IOmittedArrayBindingElementDict extends IOmittedArrayBindingElementCtor, INodeDict {
	nodeKind: NodeKind.ARRAY_BINDING_ELEMENT;
}

export interface INormalArrayBindingElementDict extends INormalArrayBindingElementCtor, INodeDict {
	nodeKind: NodeKind.ARRAY_BINDING_ELEMENT;
}

export declare type ArrayBindingElementDict = IOmittedArrayBindingElementDict|INormalArrayBindingElementDict;