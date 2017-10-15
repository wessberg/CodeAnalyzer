import {PredicateArgument} from "../node/i-node-dict";
import {IClassMethodDict} from "./i-class-method-dict";
import {isIMethodDict} from "../method/is-i-method-dict";

/**
 * Checks if the provided item is an IClassMethodDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassMethodDict (item: PredicateArgument): item is IClassMethodDict {
	return isIMethodDict(item) && (
		"name" in item &&
		"isAbstract" in item &&
		"isOptional" in item &&
		"memberIsStatic" in item &&
		"visibility" in item
	);
}