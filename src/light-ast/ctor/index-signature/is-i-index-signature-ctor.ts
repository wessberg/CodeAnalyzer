import {isITypeElementCtor} from "../type-element/is-i-type-element-ctor";
import {IIndexSignatureCtor} from "./i-index-signature-ctor";
import {isISignatureCtor} from "../signature/is-i-signature-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IIndexSignatureCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIIndexSignatureCtor (item: PredicateArgument): item is IIndexSignatureCtor {
	return isITypeElementCtor(item) && isISignatureCtor(item);
}