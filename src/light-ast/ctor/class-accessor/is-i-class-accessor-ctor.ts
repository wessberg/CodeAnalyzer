import {IClassAccessorCtor} from "./class-accessor-ctor";
import {isIAccessorCtor} from "../accessor/is-i-accessor-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IClassAccessorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassAccessorCtor (item: PredicateArgument): item is IClassAccessorCtor {
	return isIAccessorCtor(item) && (
		"isStatic" in item &&
		"isAbstract" in item &&
		"visibility" in item
	);
}