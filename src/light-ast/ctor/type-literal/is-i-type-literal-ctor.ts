import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {ITypeLiteralCtor} from "./i-type-literal-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an ITypeLiteralCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isITypeLiteralCtor (item: PredicateArgument): item is ITypeLiteralCtor {
	return !isTypescriptNode(item) && item != null && (
		"members" in item
	);
}