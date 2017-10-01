import {PredicateArgument} from "../node/i-node-dict";
import {ISetAccessorDict} from "./accessor-dict";
import {isIAccessorDict} from "./is-i-accessor-dict";
import {AccessorKind} from "./accessor-kind";
import {isIFunctionLikeWithParametersDict} from "../function-like-with-parameters/is-i-function-like-with-parameters-dict";

/**
 * Checks if the provided item is an ISetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isISetAccessorDict (item: PredicateArgument): item is ISetAccessorDict {
	return isIAccessorDict(item) && isIFunctionLikeWithParametersDict(item) && (
		item.kind === AccessorKind.SET
	);
}