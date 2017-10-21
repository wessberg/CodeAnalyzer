import {PredicateArgument} from "../node/i-node-dict";
import {IFunctionDict} from "./function-dict";
import {isIFunctionCtor} from "../../ctor/function/is-i-function-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IFunctionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIFunctionDict (item: PredicateArgument): item is IFunctionDict {
	return isIFunctionCtor(item) && isINodeDict(item) && item.nodeKind === "FUNCTION";
}