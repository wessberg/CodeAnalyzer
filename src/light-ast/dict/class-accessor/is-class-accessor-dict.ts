import {PredicateArgument} from "../node/i-node-dict";
import {ClassAccessorDict} from "./class-accessor-dict";
import {isIClassGetAccessorDict} from "./is-i-class-get-accessor-dict";
import {isIClassSetAccessorDict} from "./is-i-class-set-accessor-dict";

/**
 * Checks if the provided item is an ClassAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isClassAccessorDict (item: PredicateArgument): item is ClassAccessorDict {
	return isIClassGetAccessorDict(item) || isIClassSetAccessorDict(item);
}