import {IPropertySignatureCtor} from "./i-property-signature-ctor";
import {isITypeElementCtor} from "../type-element/is-i-type-element-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IPropertySignatureCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIPropertySignatureCtor (item: PredicateArgument): item is IPropertySignatureCtor {
	return isITypeElementCtor(item) && (
		"type" in item &&
		"initializer" in item &&
		"isReadonly" in item
	);
}