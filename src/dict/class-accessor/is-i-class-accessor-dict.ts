import {PredicateArgument} from "../node/i-node-dict";
import {IClassAccessorDict} from "./class-accessor-dict";
import {isIAccessorDict} from "../accessor/is-i-accessor-dict";

/**
 * Checks if the provided item is an IClassAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassAccessorDict (item: PredicateArgument): item is IClassAccessorDict {
	return isIAccessorDict(item) && (
		"memberIsStatic" in item &&
		"isAbstract" in item &&
		"visibility" in item
	);
}