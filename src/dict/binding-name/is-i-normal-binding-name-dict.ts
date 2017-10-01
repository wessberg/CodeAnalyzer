import {PredicateArgument} from "../node/i-node-dict";
import {INormalBindingNameDict} from "./binding-name-dict";
import {BindingNameKind} from "./binding-name-kind";
import {isIBindingNameDict} from "./is-i-binding-name-dict";

/**
 * Checks if the provided item is an INormalBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalBindingNameDict (item: PredicateArgument): item is INormalBindingNameDict {
	return isIBindingNameDict(item) && (
		item.kind === BindingNameKind.NORMAL &&
		"name" in item
	);
}