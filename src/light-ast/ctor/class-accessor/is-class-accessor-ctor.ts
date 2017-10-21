import {ClassAccessorCtor} from "./class-accessor-ctor";
import {isIClassGetAccessorCtor} from "./is-i-class-get-accessor-ctor";
import {isIClassSetAccessorCtor} from "./is-i-class-set-accessor-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an ClassAccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isClassAccessorCtor (item: PredicateArgument): item is ClassAccessorCtor {
	return isIClassGetAccessorCtor(item) || isIClassSetAccessorCtor(item);
}