import {PredicateArgument} from "../node/i-node-dict";
import {IAccessorDict} from "./accessor-dict";
import {isIAccessorCtor} from "../../ctor/accessor/is-i-accessor-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIAccessorDict (item: PredicateArgument): item is IAccessorDict {
	return isIAccessorCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.ACCESSOR;
}