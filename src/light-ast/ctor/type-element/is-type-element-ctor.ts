import {TypeElementCtor} from "./i-type-element-ctor";
import {isIPropertySignatureCtor} from "../property-signature/is-i-property-signature-ctor";
import {isICallSignatureCtor} from "../call-signature/is-i-call-signature-ctor";
import {isIConstructSignatureCtor} from "../construct-signature/is-i-construct-signature-ctor";
import {isIMethodSignatureCtor} from "../method-signature/is-i-method-signature-ctor";
import {isIIndexSignatureCtor} from "../index-signature/is-i-index-signature-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an TypeElementCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isTypeElementCtor (item: PredicateArgument): item is TypeElementCtor {
	return isIPropertySignatureCtor(item) || isICallSignatureCtor(item) || isIConstructSignatureCtor(item) || isIMethodSignatureCtor(item) || isIIndexSignatureCtor(item);
}