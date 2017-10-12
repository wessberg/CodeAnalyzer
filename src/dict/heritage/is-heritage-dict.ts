import {PredicateArgument} from "../node/i-node-dict";
import {isIExtendsHeritageDict} from "./is-i-extends-heritage-dict";
import {isIImplementsHeritageDict} from "./is-i-implements-heritage-dict";
import {HeritageDict} from "./i-heritage-clause-dict";

/**
 * Checks if the provided item is an HeritageDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isHeritageDict (item: PredicateArgument): item is HeritageDict {
	return isIExtendsHeritageDict(item) || isIImplementsHeritageDict(item);
}