import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {ICallExpressionCtor} from "./i-call-expression-ctor";

/**
 * Checks if the provided item is an ICallExpressionCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isICallExpressionCtor (item: PredicateArgument): item is ICallExpressionCtor {
	return !isTypescriptNode(item) && item != null && (
		"expression" in item &&
		"typeArguments" in item &&
		"arguments" in item
	);
}