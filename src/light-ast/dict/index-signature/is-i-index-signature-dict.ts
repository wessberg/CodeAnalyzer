import {PredicateArgument} from "../node/i-node-dict";
import {IIndexSignatureDict} from "./i-index-signature-dict";
import {isIIndexSignatureCtor} from "../../ctor/index-signature/is-i-index-signature-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IIndexSignatureDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIIndexSignatureDict (item: PredicateArgument): item is IIndexSignatureDict {
	return isIIndexSignatureCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.INDEX_SIGNATURE;
}