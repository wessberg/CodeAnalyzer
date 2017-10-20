import {PredicateArgument} from "../node/i-node-dict";
import {IMethodDict} from "./i-method-dict";
import {isIMethodCtor} from "../../ctor/method/is-i-method-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IMethodDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIMethodDict (item: PredicateArgument): item is IMethodDict {
	return isIMethodCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.METHOD;
}