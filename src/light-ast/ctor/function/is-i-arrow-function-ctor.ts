import {IArrowFunctionCtor} from "./function-ctor";
import {isIFunctionCtor} from "./is-i-function-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {FunctionKind} from "../../dict/function/function-kind";

/**
 * Checks if the provided item is an IArrowFunctionCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIArrowFunctionCtor (item: PredicateArgument): item is IArrowFunctionCtor {
	return isIFunctionCtor(item) && (
		item.kind === FunctionKind.ARROW &&
		"name" in item
	);
}