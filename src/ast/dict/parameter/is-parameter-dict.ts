import {PredicateArgument} from "../node/i-node-dict";
import {ParameterDict} from "./parameter-dict";
import {isINormalParameterDict} from "./is-i-normal-parameter-dict";
import {isIObjectBindingParameterDict} from "./is-i-object-binding-parameter-dict";
import {isIArrayBindingParameterDict} from "./is-i-array-binding-parameter-dict";

/**
 * Checks if the provided item is an ParameterDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isParameterDict (item: PredicateArgument): item is ParameterDict {
	return isINormalParameterDict(item) || isIObjectBindingParameterDict(item) || isIArrayBindingParameterDict(item);
}