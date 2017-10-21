import {IInterfaceCtor} from "./i-interface-ctor";
import {isITypeLiteralCtor} from "../type-literal/is-i-type-literal-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IInterfaceCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIInterfaceCtor (item: PredicateArgument): item is IInterfaceCtor {
	return isITypeLiteralCtor(item) && (
		"name" in item &&
		"extends" in item &&
		"typeParameters" in item &&
		"members" in item
	);
}