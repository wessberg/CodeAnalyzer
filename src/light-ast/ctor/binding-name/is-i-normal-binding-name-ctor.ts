import {INormalBindingNameCtor} from "./binding-name-ctor";
import {isIBindingNameCtor} from "./is-i-binding-name-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {BindingNameKind} from "../../dict/binding-name/binding-name-kind";

/**
 * Checks if the provided item is an INormalBindingNameCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalBindingNameCtor (item: PredicateArgument): item is INormalBindingNameCtor {
	return isIBindingNameCtor(item) && (
		item.kind === BindingNameKind.NORMAL &&
		"name" in item
	);
}