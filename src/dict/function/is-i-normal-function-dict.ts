import {PredicateArgument} from "../node/i-node-dict";
import {INormalFunctionDict} from "./function-dict";
import {isIFunctionDict} from "./is-i-function-dict";
import {FunctionKind} from "./function-kind";

/**
 * Checks if the provided item is an INormalFunctionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalFunctionDict (item: PredicateArgument): item is INormalFunctionDict {
	return isIFunctionDict(item) && (
		item.kind === FunctionKind.NORMAL &&
		"name" in item
	);
}