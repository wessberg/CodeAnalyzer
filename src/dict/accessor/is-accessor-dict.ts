import {PredicateArgument} from "../node/i-node-dict";
import {AccessorDict} from "./accessor-dict";
import {isIGetAccessorDict} from "./is-i-get-accessor-dict";
import {isISetAccessorDict} from "./is-i-set-accessor-dict";

/**
 * Checks if the provided item is an AccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isAccessorDict (item: PredicateArgument): item is AccessorDict {
	return isIGetAccessorDict(item) || isISetAccessorDict(item);
}