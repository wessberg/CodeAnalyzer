import {isIHeritageCtor} from "./is-i-heritage-ctor";
import {IExtendsHeritageCtor} from "./i-heritage-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {isINameWithTypeArguments} from "../../dict/name-with-type-arguments/is-i-name-with-type-arguments";

/**
 * Checks if the provided item is an IExtendsHeritageCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIExtendsHeritageCtor (item: PredicateArgument): item is IExtendsHeritageCtor {
	return isIHeritageCtor(item) && isINameWithTypeArguments(item);
}