import {INormalFunctionCtor} from "./function-ctor";
import {isIFunctionCtor} from "./is-i-function-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an INormalFunctionCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalFunctionCtor (item: PredicateArgument): item is INormalFunctionCtor {
	return isIFunctionCtor(item) && (
		item.kind === "NORMAL" &&
		"name" in item
	);
}