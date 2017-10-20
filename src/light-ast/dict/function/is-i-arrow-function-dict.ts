import {PredicateArgument} from "../node/i-node-dict";
import {IArrowFunctionDict} from "./function-dict";
import {isIArrowFunctionCtor} from "../../ctor/function/is-i-arrow-function-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IArrowFunctionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIArrowFunctionDict (item: PredicateArgument): item is IArrowFunctionDict {
	return isIArrowFunctionCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.FUNCTION;
}