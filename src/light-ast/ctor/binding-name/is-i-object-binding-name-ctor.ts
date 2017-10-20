import {IObjectBindingNameCtor} from "./binding-name-ctor";
import {isIBindingNameCtor} from "./is-i-binding-name-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {BindingNameKind} from "../../dict/binding-name/binding-name-kind";

/**
 * Checks if the provided item is an IObjectBindingNameCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIObjectBindingNameCtor (item: PredicateArgument): item is IObjectBindingNameCtor {
	return isIBindingNameCtor(item) && (
		item.kind === BindingNameKind.OBJECT_BINDING &&
		"elements" in item
	);
}