import {PredicateArgument} from "../node/i-node-dict";
import {IBindingNameDict} from "./binding-name-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIBindingNameDict (item: PredicateArgument): item is IBindingNameDict {
	return !isTypescriptNode(item) && item != null && "kind" in item;
}