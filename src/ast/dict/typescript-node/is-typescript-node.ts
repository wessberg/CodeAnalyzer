import {PredicateArgument} from "../node/i-node-dict";
import {Node} from "typescript";

/**
 * Checks if the provided item is a Typescript Node
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isTypescriptNode (item: PredicateArgument): item is Node {
	return item != null && (
		// isTextRange
		"pos" in item &&
		"end" in item &&
		"kind" in item &&
		"flags" in item
	);
}