import {PredicateArgument} from "../node/i-node-dict";
import {isIFunctionLikeDict} from "../function-like/is-i-function-like-dict";
import {IAccessorDict} from "./accessor-dict";

/**
 * Checks if the provided item is an IAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIAccessorDict (item: PredicateArgument): item is IAccessorDict {
	return isIFunctionLikeDict(item) && (
		"kind" in item &&
		"name" in item
	);
}