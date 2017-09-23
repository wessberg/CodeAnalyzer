import {PredicateArgument} from "../node/i-node-dict";
import {FunctionDict} from "./function-dict";
import {isINormalFunctionDict} from "./is-i-normal-function-dict";
import {isIArrowFunctionDict} from "./is-i-arrow-function-dict";

/**
 * Checks if the provided item is a FunctionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isFunctionDict (item: PredicateArgument): item is FunctionDict {
	return isINormalFunctionDict(item) || isIArrowFunctionDict(item);
}