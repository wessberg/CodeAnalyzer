import {PredicateArgument} from "../node/i-node-dict";
import {IArrowFunctionDict} from "./function-dict";
import {isIFunctionDict} from "./is-i-function-dict";
import {FunctionKind} from "./function-kind";

/**
 * Checks if the provided item is an IArrowFunctionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIArrowFunctionDict (item: PredicateArgument): item is IArrowFunctionDict {
	return isIFunctionDict(item) && (
		item.kind === FunctionKind.ARROW &&
		"name" in item
	);
}