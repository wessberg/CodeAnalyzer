import {isINodeDict} from "../node/is-i-node-dict";
import {PredicateArgument} from "../node/i-node-dict";
import {IObjectBindingElementDict} from "./i-object-binding-element-dict";
import {isIObjectBindingElementCtor} from "../../ctor/binding-element/is-i-object-binding-element-ctor";

/**
 * Checks if the provided item is an IObjectBindingElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIObjectBindingElementDict (item: PredicateArgument): item is IObjectBindingElementDict {
	return isIObjectBindingElementCtor(item) && isINodeDict(item) && item.nodeKind === "OBJECT_BINDING_ELEMENT";
}