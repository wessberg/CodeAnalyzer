import {INormalFunctionCtor} from "./function-ctor";
import {isIFunctionCtor} from "./is-i-function-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {FunctionKind} from "../../dict/function/function-kind";

/**
 * Checks if the provided item is an INormalFunctionCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalFunctionCtor (item: PredicateArgument): item is INormalFunctionCtor {
	return isIFunctionCtor(item) && (
		item.kind === FunctionKind.NORMAL &&
		"name" in item
	);
}