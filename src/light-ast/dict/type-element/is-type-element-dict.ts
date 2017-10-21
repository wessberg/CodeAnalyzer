import {PredicateArgument} from "../node/i-node-dict";
import {TypeElementDict} from "./i-type-element-dict";
import {isIPropertySignatureDict} from "../property-signature/is-i-property-signature-dict";
import {isICallSignatureDict} from "../call-signature/is-i-call-signature-dict";
import {isIConstructSignatureDict} from "../construct-signature/is-i-construct-signature-dict";
import {isIMethodSignatureDict} from "../method-signature/is-i-method-signature-dict";
import {isIIndexSignatureDict} from "../index-signature/is-i-index-signature-dict";

/**
 * Checks if the provided item is an TypeElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isTypeElementDict (item: PredicateArgument): item is TypeElementDict {
	return isIPropertySignatureDict(item) || isICallSignatureDict(item) || isIConstructSignatureDict(item) || isIMethodSignatureDict(item) || isIIndexSignatureDict(item);
}