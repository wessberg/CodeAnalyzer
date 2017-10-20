import {PredicateArgument} from "../node/i-node-dict";
import {INormalFunctionDict} from "./function-dict";
import {isINormalFunctionCtor} from "../../ctor/function/is-i-normal-function-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an INormalFunctionDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalFunctionDict (item: PredicateArgument): item is INormalFunctionDict {
	return isINormalFunctionCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.FUNCTION;
}