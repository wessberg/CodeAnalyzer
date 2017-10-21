import {PredicateArgument} from "../node/i-node-dict";
import {IObjectBindingNameDict} from "./binding-name-dict";
import {isINodeDict} from "../node/is-i-node-dict";
import {isIObjectBindingNameCtor} from "../../ctor/binding-name/is-i-object-binding-name-ctor";

/**
 * Checks if the provided item is an IObjectBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIObjectBindingNameDict (item: PredicateArgument): item is IObjectBindingNameDict {
	return isIObjectBindingNameCtor(item) && isINodeDict(item) && item.nodeKind === "BINDING_NAME";
}