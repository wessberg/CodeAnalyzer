import {IMethodSignatureCtor} from "./i-method-signature-ctor";
import {isITypeElementCtor} from "../type-element/is-i-type-element-ctor";
import {isISignatureCtor} from "../signature/is-i-signature-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IMethodSignatureCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIMethodSignatureCtor (item: PredicateArgument): item is IMethodSignatureCtor {
	return isITypeElementCtor(item) && isISignatureCtor(item) && (
		"name" in item
	);
}