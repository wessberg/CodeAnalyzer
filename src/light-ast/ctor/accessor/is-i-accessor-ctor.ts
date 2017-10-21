import {isIFunctionLikeCtor} from "../function-like/is-i-function-like-ctor";
import {IAccessorCtor} from "./accessor-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IAccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIAccessorCtor (item: PredicateArgument): item is IAccessorCtor {
	return isIFunctionLikeCtor(item) && (
		"kind" in item &&
		"name" in item
	);
}