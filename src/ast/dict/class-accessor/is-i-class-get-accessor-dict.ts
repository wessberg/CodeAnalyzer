import {PredicateArgument} from "../node/i-node-dict";
import {IClassGetAccessorDict} from "./class-accessor-dict";
import {isIClassAccessorDict} from "./is-i-class-accessor-dict";
import {isIFunctionLikeDict} from "../function-like/is-i-function-like-dict";
import {AccessorKind} from "../accessor/accessor-kind";

/**
 * Checks if the provided item is an IClassGetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassGetAccessorDict (item: PredicateArgument): item is IClassGetAccessorDict {
	return isIClassAccessorDict(item) && isIFunctionLikeDict(item) && (
		item.kind === AccessorKind.GET
	);
}