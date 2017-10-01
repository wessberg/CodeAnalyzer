import {PredicateArgument} from "../node/i-node-dict";
import {IArrayBindingNameDict} from "./binding-name-dict";
import {BindingNameKind} from "./binding-name-kind";
import {isIBindingNameDict} from "./is-i-binding-name-dict";

/**
 * Checks if the provided item is an IArrayBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIArrayBindingNameDict (item: PredicateArgument): item is IArrayBindingNameDict {
	return isIBindingNameDict(item) && (
		item.kind === BindingNameKind.ARRAY_BINDING &&
		"elements" in item
	);
}