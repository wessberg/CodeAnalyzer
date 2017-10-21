import {PredicateArgument} from "../node/i-node-dict";
import {IClassGetAccessorDict} from "./class-accessor-dict";
import {isIClassGetAccessorCtor} from "../../ctor/class-accessor/is-i-class-get-accessor-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IClassGetAccessorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassGetAccessorDict (item: PredicateArgument): item is IClassGetAccessorDict {
	return isIClassGetAccessorCtor(item) && isINodeDict(item) && item.nodeKind === "CLASS_ACCESSOR";
}