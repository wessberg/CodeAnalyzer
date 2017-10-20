import {PredicateArgument} from "../node/i-node-dict";
import {IClassSetAccessorDict} from "./class-accessor-dict";
import {isIClassSetAccessorCtor} from "../../ctor/class-accessor/is-i-class-set-accessor-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IClassSetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassSetAccessorDict (item: PredicateArgument): item is IClassSetAccessorDict {
	return isIClassSetAccessorCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.CLASS_ACCESSOR;
}