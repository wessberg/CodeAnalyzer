import {PredicateArgument} from "../node/i-node-dict";
import {IFunctionDict} from "./function-dict";
import {isIFunctionLikeWithParametersDict} from "../function-like-with-parameters/is-i-function-like-with-parameters-dict";

/**
 * Checks if the provided item is an IFunctionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionDict (item: PredicateArgument): item is IFunctionDict {
	return isIFunctionLikeWithParametersDict(item) && "kind" in item;
}