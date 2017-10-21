import {isIGetAccessorCtor} from "./is-i-get-accessor-ctor";
import {isISetAccessorCtor} from "./is-i-set-accessor-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {AccessorCtor} from "./accessor-ctor";

/**
 * Checks if the provided item is an AccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isAccessorCtor (item: PredicateArgument): item is AccessorCtor {
	return isIGetAccessorCtor(item) || isISetAccessorCtor(item);
}