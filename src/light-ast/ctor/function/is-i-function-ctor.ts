import {IFunctionCtor} from "./function-ctor";
import {isIFunctionLikeWithParametersCtor} from "../function-like-with-parameters/is-i-function-like-with-parameters-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IFunctionCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionCtor (item: PredicateArgument): item is IFunctionCtor {
	return isIFunctionLikeWithParametersCtor(item) && "kind" in item;
}