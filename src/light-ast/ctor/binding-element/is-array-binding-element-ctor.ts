import {ArrayBindingElementCtor} from "./array-binding-element-ctor";
import {isIOmittedArrayBindingElementCtor} from "./is-i-omitted-array-binding-element-ctor";
import {isINormalArrayBindingElementCtor} from "./is-i-normal-array-binding-element-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an ArrayBindingElementCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isArrayBindingElementCtor (item: PredicateArgument): item is ArrayBindingElementCtor {
	return isIOmittedArrayBindingElementCtor(item) || isINormalArrayBindingElementCtor(item);
}