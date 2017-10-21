import {PredicateArgument} from "../node/i-node-dict";
import {ICallSignatureDict} from "./i-call-signature-dict";
import {isICallSignatureCtor} from "../../ctor/call-signature/is-i-call-signature-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an ICallSignatureDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isICallSignatureDict (item: PredicateArgument): item is ICallSignatureDict {
	return isICallSignatureCtor(item) && isINodeDict(item) && item.nodeKind === "CALL_SIGNATURE";
}