import {IArrayBindingNameCtor} from "./binding-name-ctor";
import {isIBindingNameCtor} from "./is-i-binding-name-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {BindingNameKind} from "../../dict/binding-name/binding-name-kind";

/**
 * Checks if the provided item is an IArrayBindingNameCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIArrayBindingNameCtor (item: PredicateArgument): item is IArrayBindingNameCtor {
	return isIBindingNameCtor(item) && (
		item.kind === BindingNameKind.ARRAY_BINDING &&
		"elements" in item
	);
}