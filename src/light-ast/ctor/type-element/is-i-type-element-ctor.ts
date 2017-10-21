import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {ITypeElementCtor} from "./i-type-element-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an ITypeElementCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isITypeElementCtor (item: PredicateArgument): item is ITypeElementCtor {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"isOptional" in item
	);
}