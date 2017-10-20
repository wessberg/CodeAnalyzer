import {BindingNameCtor} from "./binding-name-ctor";
import {isINormalBindingNameCtor} from "./is-i-normal-binding-name-ctor";
import {isIObjectBindingNameCtor} from "./is-i-object-binding-name-ctor";
import {isIArrayBindingNameCtor} from "./is-i-array-binding-name-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an BindingNameCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isBindingNameCtor (item: PredicateArgument): item is BindingNameCtor {
	return isINormalBindingNameCtor(item) || isIObjectBindingNameCtor(item) || isIArrayBindingNameCtor(item);
}