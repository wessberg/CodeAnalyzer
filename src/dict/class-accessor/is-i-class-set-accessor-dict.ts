import {PredicateArgument} from "../node/i-node-dict";
import {IClassSetAccessorDict} from "./class-accessor-dict";
import {isIClassAccessorDict} from "./is-i-class-accessor-dict";
import {AccessorKind} from "../accessor/accessor-kind";

/**
 * Checks if the provided item is an IClassSetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassSetAccessorDict (item: PredicateArgument): item is IClassSetAccessorDict {
	return isIClassAccessorDict(item) && (
		item.kind === AccessorKind.SET &&
		"decorators" in item &&
		"body" in item &&
		"parameters" in item
	);
}