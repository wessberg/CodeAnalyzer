import {IFunctionLikeWithParametersCtor} from "./i-function-like-with-parameters-ctor";
import {isIFunctionLikeCtor} from "../function-like/is-i-function-like-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IFunctionLikeWithParametersCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionLikeWithParametersCtor (item: PredicateArgument): item is IFunctionLikeWithParametersCtor {
	return isIFunctionLikeCtor(item) && (
		"parameters" in item &&
		"typeParameters" in item
	);
}