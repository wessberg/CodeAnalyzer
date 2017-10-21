import {PredicateArgument} from "../node/i-node-dict";
import {IMethodSignatureDict} from "./i-method-signature-dict";
import {isIMethodSignatureCtor} from "../../ctor/method-signature/is-i-method-signature-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IMethodSignatureDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIMethodSignatureDict (item: PredicateArgument): item is IMethodSignatureDict {
	return isIMethodSignatureCtor(item) && isINodeDict(item) && item.nodeKind === "METHOD_SIGNATURE";
}