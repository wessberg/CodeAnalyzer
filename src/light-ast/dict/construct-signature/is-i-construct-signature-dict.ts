import {PredicateArgument} from "../node/i-node-dict";
import {IConstructSignatureDict} from "./i-construct-signature-dict";
import {isIConstructSignatureCtor} from "../../ctor/construct-signature/is-i-construct-signature-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IConstructSignatureDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIConstructSignatureDict (item: PredicateArgument): item is IConstructSignatureDict {
	return isIConstructSignatureCtor(item) && isINodeDict(item) && item.nodeKind === "CONSTRUCT_SIGNATURE";
}