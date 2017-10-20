import {PredicateArgument} from "../node/i-node-dict";
import {IFunctionLikeWithParametersDict} from "./i-function-like-with-parameters-dict";
import {isIFunctionLikeWithParametersCtor} from "../../ctor/function-like-with-parameters/is-i-function-like-with-parameters-ctor";

/**
 * Checks if the provided item is an IFunctionLikeWithParametersDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionLikeWithParametersDict (item: PredicateArgument): item is IFunctionLikeWithParametersDict {
	return isIFunctionLikeWithParametersCtor(item);
}