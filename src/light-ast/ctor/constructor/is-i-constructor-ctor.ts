import {IConstructorCtor} from "./i-constructor-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IConstructorCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIConstructorCtor (item: PredicateArgument): item is IConstructorCtor {
	return !isTypescriptNode(item) && item != null && (
		"body" in item &&
		"parameters" in item
	);
}