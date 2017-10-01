import {PredicateArgument} from "../node/i-node-dict";
import {IOmittedArrayBindingElementDict} from "./array-binding-element-dict";
import {ArrayBindingElementKind} from "./array-binding-element-kind";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IOmittedArrayBindingElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIOmittedArrayBindingElementDict (item: PredicateArgument): item is IOmittedArrayBindingElementDict {
	return !isTypescriptNode(item) && item != null && "kind" in item && item.kind === ArrayBindingElementKind.OMITTED;
}