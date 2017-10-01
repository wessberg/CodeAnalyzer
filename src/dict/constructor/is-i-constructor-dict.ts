import {PredicateArgument} from "../node/i-node-dict";
import {IConstructorDict} from "./i-constructor-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IConstructorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIConstructorDict (item: PredicateArgument): item is IConstructorDict {
	return !isTypescriptNode(item) && item != null && (
		"body" in item &&
		"parameters" in item
	);
}