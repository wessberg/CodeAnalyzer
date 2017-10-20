import {PredicateArgument} from "../node/i-node-dict";
import {IGetAccessorDict} from "./accessor-dict";
import {isINodeDict} from "../node/is-i-node-dict";
import {isIGetAccessorCtor} from "../../ctor/accessor/is-i-get-accessor-ctor";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IGetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIGetAccessorDict (item: PredicateArgument): item is IGetAccessorDict {
	return isIGetAccessorCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.ACCESSOR;
}