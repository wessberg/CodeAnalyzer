import {IClassSetAccessorCtor} from "./class-accessor-ctor";
import {isIClassAccessorCtor} from "./is-i-class-accessor-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IClassSetAccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassSetAccessorCtor (item: PredicateArgument): item is IClassSetAccessorCtor {
	return isIClassAccessorCtor(item) && (
		item.kind === "SET" &&
		"decorators" in item &&
		"body" in item &&
		"parameters" in item
	);
}