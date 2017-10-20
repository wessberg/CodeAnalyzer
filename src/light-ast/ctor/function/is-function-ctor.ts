import {FunctionCtor} from "./function-ctor";
import {isINormalFunctionCtor} from "./is-i-normal-function-ctor";
import {isIArrowFunctionCtor} from "./is-i-arrow-function-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is a FunctionCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isFunctionCtor (item: PredicateArgument): item is FunctionCtor {
	return isINormalFunctionCtor(item) || isIArrowFunctionCtor(item);
}