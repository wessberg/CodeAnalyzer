import {isITypeElementCtor} from "../type-element/is-i-type-element-ctor";
import {IConstructSignatureCtor} from "./i-construct-signature-ctor";
import {isISignatureCtor} from "../signature/is-i-signature-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IConstructSignatureCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIConstructSignatureCtor (item: PredicateArgument): item is IConstructSignatureCtor {
	return isITypeElementCtor(item) && isISignatureCtor(item);
}