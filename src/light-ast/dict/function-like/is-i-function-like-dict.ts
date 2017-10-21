import {PredicateArgument} from "../node/i-node-dict";
import {IFunctionLikeDict} from "./i-function-like-dict";
import {isIFunctionLikeCtor} from "../../ctor/function-like/is-i-function-like-ctor";

/**
 * Checks if the provided item is an IFunctionLikeDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionLikeDict (item: PredicateArgument): item is IFunctionLikeDict {
	return isIFunctionLikeCtor(item);
}