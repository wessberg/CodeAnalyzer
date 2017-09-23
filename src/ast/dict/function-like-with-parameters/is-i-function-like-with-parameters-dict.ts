import {PredicateArgument} from "../node/i-node-dict";
import {IFunctionLikeWithParametersDict} from "./i-function-like-with-parameters-dict";
import {isIFunctionLikeDict} from "../function-like/is-i-function-like-dict";

/**
 * Checks if the provided item is an IFunctionLikeWithParametersDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionLikeWithParametersDict (item: PredicateArgument): item is IFunctionLikeWithParametersDict {
	return isIFunctionLikeDict(item) && (
		"parameters" in item &&
		"typeParameters" in item
	);
}