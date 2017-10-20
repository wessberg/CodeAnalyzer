import {PredicateArgument} from "../node/i-node-dict";
import {ISignatureDict} from "./i-signature-dict";
import {isISignatureCtor} from "../../ctor/signature/is-i-signature-ctor";

/**
 * Checks if the provided item is an ISignatureDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isISignatureDict (item: PredicateArgument): item is ISignatureDict {
	return isISignatureCtor(item);
}