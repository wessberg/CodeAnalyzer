import {IImplementsHeritageCtor} from "./i-heritage-ctor";
import {isIHeritageCtor} from "./is-i-heritage-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {isINameWithTypeArguments} from "../../dict/name-with-type-arguments/is-i-name-with-type-arguments";

/**
 * Checks if the provided item is an IImplementsHeritageCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImplementsHeritageCtor (item: PredicateArgument): item is IImplementsHeritageCtor {
	return isIHeritageCtor(item) && "elements" in (item) && (<IImplementsHeritageCtor> item).elements.every(element => isINameWithTypeArguments(element));
}