import {PredicateArgument} from "../node/i-node-dict";
import {isINodeDict} from "../node/is-i-node-dict";
import {ICallExpressionDict} from "./i-call-expression-dict";
import {isICallExpressionCtor} from "../../ctor/call-expression/is-i-call-expression-ctor";

/**
 * Checks if the provided item is an ICallExpressionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isICallExpressionDict (item: PredicateArgument): item is ICallExpressionDict {
	return isICallExpressionCtor(item) && isINodeDict(item) && item.nodeKind === "CALL_EXPRESSION";
}