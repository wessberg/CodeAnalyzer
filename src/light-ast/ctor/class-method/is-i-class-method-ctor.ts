import {IClassMethodCtor} from "./i-class-method-ctor";
import {isIMethodCtor} from "../method/is-i-method-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IClassMethodCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassMethodCtor (item: PredicateArgument): item is IClassMethodCtor {
	return isIMethodCtor(item) && (
		"name" in item &&
		"isAbstract" in item &&
		"isOptional" in item &&
		"isStatic" in item &&
		"visibility" in item
	);
}