import {ICallSignatureCtor} from "./i-call-signature-ctor";
import {isITypeElementCtor} from "../type-element/is-i-type-element-ctor";
import {isISignatureCtor} from "../signature/is-i-signature-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an ICallSignatureCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isICallSignatureCtor (item: PredicateArgument): item is ICallSignatureCtor {
	return isITypeElementCtor(item) && isISignatureCtor(item);
}