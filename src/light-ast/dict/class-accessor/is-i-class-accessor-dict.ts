import {PredicateArgument} from "../node/i-node-dict";
import {IClassAccessorDict} from "./class-accessor-dict";
import {isIClassAccessorCtor} from "../../ctor/class-accessor/is-i-class-accessor-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IClassAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassAccessorDict (item: PredicateArgument): item is IClassAccessorDict {
	return isIClassAccessorCtor(item) && isINodeDict(item) && item.nodeKind === "CLASS_ACCESSOR";
}