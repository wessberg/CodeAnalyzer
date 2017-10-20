import {PredicateArgument} from "../node/i-node-dict";
import {INormalArrayBindingElementDict} from "./array-binding-element-dict";
import {isINormalArrayBindingElementCtor} from "../../ctor/binding-element/is-i-normal-array-binding-element-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an INormalArrayBindingElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalArrayBindingElementDict (item: PredicateArgument): item is INormalArrayBindingElementDict {
	return isINormalArrayBindingElementCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.ARRAY_BINDING_ELEMENT;
}