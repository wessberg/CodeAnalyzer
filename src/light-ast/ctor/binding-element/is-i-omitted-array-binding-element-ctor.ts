import {IOmittedArrayBindingElementCtor} from "./array-binding-element-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IOmittedArrayBindingElementCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIOmittedArrayBindingElementCtor (item: PredicateArgument): item is IOmittedArrayBindingElementCtor {
	return !isTypescriptNode(item) && item != null && "kind" in item && item.kind === "OMITTED";
}