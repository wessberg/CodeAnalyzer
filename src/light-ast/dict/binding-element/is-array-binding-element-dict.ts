import {PredicateArgument} from "../node/i-node-dict";
import {ArrayBindingElementDict} from "./array-binding-element-dict";
import {isIOmittedArrayBindingElementDict} from "./is-i-omitted-array-binding-element-dict";
import {isINormalArrayBindingElementDict} from "./is-i-normal-array-binding-element-dict";

/**
 * Checks if the provided item is an ArrayBindingElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isArrayBindingElementDict (item: PredicateArgument): item is ArrayBindingElementDict {
	return isIOmittedArrayBindingElementDict(item) || isINormalArrayBindingElementDict(item);
}