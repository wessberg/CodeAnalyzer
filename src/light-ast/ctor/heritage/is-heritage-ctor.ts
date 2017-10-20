import {isIExtendsHeritageCtor} from "./is-i-extends-heritage-ctor";
import {isIImplementsHeritageCtor} from "./is-i-implements-heritage-ctor";
import {HeritageCtor} from "./i-heritage-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an HeritageCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isHeritageCtor (item: PredicateArgument): item is HeritageCtor {
	return isIExtendsHeritageCtor(item) || isIImplementsHeritageCtor(item);
}