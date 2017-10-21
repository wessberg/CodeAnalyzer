import {PredicateArgument} from "../node/i-node-dict";
import {IInterfaceDict} from "./i-interface-dict";
import {isIInterfaceCtor} from "../../ctor/interface/is-i-interface-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IInterfaceDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIInterfaceDict (item: PredicateArgument): item is IInterfaceDict {
	return isIInterfaceCtor(item) && isINodeDict(item) && item.nodeKind === "INTERFACE";
}