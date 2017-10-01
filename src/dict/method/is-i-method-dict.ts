import {PredicateArgument} from "../node/i-node-dict";
import {IMethodDict} from "./i-method-dict";
import {isIFunctionLikeWithParametersDict} from "../function-like-with-parameters/is-i-function-like-with-parameters-dict";

/**
 * Checks if the provided item is an IMethodDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIMethodDict (item: PredicateArgument): item is IMethodDict {
	return isIFunctionLikeWithParametersDict(item) && (
		"name" in item &&
		"isAsync" in item
	);
}