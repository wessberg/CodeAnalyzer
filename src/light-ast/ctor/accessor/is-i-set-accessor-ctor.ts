import {ISetAccessorCtor} from "./accessor-ctor";
import {isIAccessorCtor} from "./is-i-accessor-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {AccessorKind} from "../../dict/accessor/accessor-kind";

/**
 * Checks if the provided item is an ISetAccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isISetAccessorCtor (item: PredicateArgument): item is ISetAccessorCtor {
	return isIAccessorCtor(item) && (
		item.kind === AccessorKind.SET &&
		"decorators" in item &&
		"body" in item &&
		"parameters" in item
	);
}