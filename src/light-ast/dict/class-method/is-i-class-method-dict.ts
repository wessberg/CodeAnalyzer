import {PredicateArgument} from "../node/i-node-dict";
import {IClassMethodDict} from "./i-class-method-dict";
import {isIClassMethodCtor} from "../../ctor/class-method/is-i-class-method-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IClassMethodDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIClassMethodDict (item: PredicateArgument): item is IClassMethodDict {
	return isIClassMethodCtor(item) && isINodeDict(item) && item.nodeKind === "CLASS_METHOD";
}