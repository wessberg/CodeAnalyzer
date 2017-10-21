import {IHeritageCtor} from "./i-heritage-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IHeritageCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIHeritageCtor (item: PredicateArgument): item is IHeritageCtor {
	return item != null && "kind" in item;
}