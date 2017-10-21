import {PredicateArgument} from "../node/i-node-dict";
import {INormalBindingNameDict} from "./binding-name-dict";
import {isINodeDict} from "../node/is-i-node-dict";
import {isINormalBindingNameCtor} from "../../ctor/binding-name/is-i-normal-binding-name-ctor";

/**
 * Checks if the provided item is an INormalBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalBindingNameDict (item: PredicateArgument): item is INormalBindingNameDict {
	return isINormalBindingNameCtor(item) && isINodeDict(item) && item.nodeKind === "BINDING_NAME";
}