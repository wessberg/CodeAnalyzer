import {PredicateArgument} from "../node/i-node-dict";
import {ITypeElementDict} from "./i-type-element-dict";
import {isITypeElementCtor} from "../../ctor/type-element/is-i-type-element-ctor";

/**
 * Checks if the provided item is an ITypeElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isITypeElementDict (item: PredicateArgument): item is ITypeElementDict {
	return isITypeElementCtor(item);
}