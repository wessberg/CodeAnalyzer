import {PredicateArgument} from "../node/i-node-dict";
import {IHeritageDict} from "./i-heritage-clause-dict";

/**
 * Checks if the provided item is an IHeritageDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIHeritageDict (item: PredicateArgument): item is IHeritageDict {
	return item != null && "kind" in item;
}