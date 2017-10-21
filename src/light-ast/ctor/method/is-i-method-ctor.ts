import {IMethodCtor} from "./i-method-ctor";
import {isIFunctionLikeWithParametersCtor} from "../function-like-with-parameters/is-i-function-like-with-parameters-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IMethodCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIMethodCtor (item: PredicateArgument): item is IMethodCtor {
	return isIFunctionLikeWithParametersCtor(item) && (
		"name" in item &&
		"isAsync" in item
	);
}