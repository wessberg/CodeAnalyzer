import {PredicateArgument} from "../node/i-node-dict";
import {IObjectBindingNameDict} from "./binding-name-dict";
import {BindingNameKind} from "./binding-name-kind";
import {isIBindingNameDict} from "./is-i-binding-name-dict";

/**
 * Checks if the provided item is an IObjectBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIObjectBindingNameDict (item: PredicateArgument): item is IObjectBindingNameDict {
	return isIBindingNameDict(item) && (
		item.kind === BindingNameKind.OBJECT_BINDING &&
		"elements" in item
	);
}