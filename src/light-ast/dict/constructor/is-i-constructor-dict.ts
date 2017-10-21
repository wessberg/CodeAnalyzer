import {PredicateArgument} from "../node/i-node-dict";
import {IConstructorDict} from "./i-constructor-dict";
import {isIConstructorCtor} from "../../ctor/constructor/is-i-constructor-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IConstructorDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIConstructorDict (item: PredicateArgument): item is IConstructorDict {
	return isIConstructorCtor(item) && isINodeDict(item) && item.nodeKind === "CONSTRUCTOR";
}