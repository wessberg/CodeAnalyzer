import {INodeDict, PredicateArgument} from "./i-node-dict";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";

/**
 * Checks if the provided item is an INodeDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINodeDict (item: PredicateArgument): item is INodeDict {
	return !isTypescriptNode(item) && item != null && "nodeKind" in item;
}