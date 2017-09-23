import {PredicateArgument} from "../node/i-node-dict";
import {IFunctionLikeDict} from "./i-function-like-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IFunctionLikeDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionLikeDict (item: PredicateArgument): item is IFunctionLikeDict {
	return !isTypescriptNode(item) && item != null && (
		"isAsync" in item &&
		"decorators" in item &&
		"type" in item &&
		"body" in item
	);
}