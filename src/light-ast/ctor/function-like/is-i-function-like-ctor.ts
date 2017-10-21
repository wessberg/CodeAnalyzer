import {IFunctionLikeCtor} from "./i-function-like-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IFunctionLikeCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionLikeCtor (item: PredicateArgument): item is IFunctionLikeCtor {
	return !isTypescriptNode(item) && item != null && (
		"isAsync" in item &&
		"decorators" in item &&
		"type" in item &&
		"body" in item
	);
}