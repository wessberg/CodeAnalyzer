import {PredicateArgument} from "../node/i-node-dict";
import {IGetAccessorDict} from "./accessor-dict";
import {isIAccessorDict} from "./is-i-accessor-dict";
import {AccessorKind} from "./accessor-kind";
import {isIFunctionLikeDict} from "../function-like/is-i-function-like-dict";

/**
 * Checks if the provided item is an IGetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIGetAccessorDict (item: PredicateArgument): item is IGetAccessorDict {
	return isIAccessorDict(item) && isIFunctionLikeDict(item) && (
		item.kind === AccessorKind.GET
	);
}