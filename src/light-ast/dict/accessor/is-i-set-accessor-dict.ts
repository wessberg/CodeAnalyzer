import {PredicateArgument} from "../node/i-node-dict";
import {ISetAccessorDict} from "./accessor-dict";
import {isINodeDict} from "../node/is-i-node-dict";
import {isISetAccessorCtor} from "../../ctor/accessor/is-i-set-accessor-ctor";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an ISetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isISetAccessorDict (item: PredicateArgument): item is ISetAccessorDict {
	return isISetAccessorCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.ACCESSOR;
}