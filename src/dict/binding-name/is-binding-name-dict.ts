import {PredicateArgument} from "../node/i-node-dict";
import {BindingNameDict} from "./binding-name-dict";
import {isINormalBindingNameDict} from "./is-i-normal-binding-name-dict";
import {isIObjectBindingNameDict} from "./is-i-object-binding-name-dict";
import {isIArrayBindingNameDict} from "./is-i-array-binding-name-dict";

/**
 * Checks if the provided item is an BindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isBindingNameDict (item: PredicateArgument): item is BindingNameDict {
	return isINormalBindingNameDict(item) || isIObjectBindingNameDict(item) || isIArrayBindingNameDict(item);
}