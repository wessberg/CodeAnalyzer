import {PredicateArgument} from "../node/i-node-dict";
import {IPropertySignatureDict} from "./i-property-signature-dict";
import {isIPropertySignatureCtor} from "../../ctor/property-signature/is-i-property-signature-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IPropertySignatureDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIPropertySignatureDict (item: PredicateArgument): item is IPropertySignatureDict {
	return isIPropertySignatureCtor(item) && isINodeDict(item) && item.nodeKind === "PROPERTY_SIGNATURE";
}