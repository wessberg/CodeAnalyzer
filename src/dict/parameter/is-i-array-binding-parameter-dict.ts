import {PredicateArgument} from "../node/i-node-dict";
import {IArrayBindingParameterDict} from "./parameter-dict";
import {ParameterKind} from "./parameter-kind";
import {isIParameterDict} from "./is-i-parameter-dict";
import {isIArrayBindingNameDict} from "../binding-name/is-i-array-binding-name-dict";

/**
 * Checks if the provided item is an IArrayBindingParameterDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIArrayBindingParameterDict (item: PredicateArgument): item is IArrayBindingParameterDict {
	return isIParameterDict(item) && (
		item.kind === ParameterKind.ARRAY_BINDING &&
		"name" in item &&
		isIArrayBindingNameDict(item.kind)
	);
}