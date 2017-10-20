import {PredicateArgument} from "../node/i-node-dict";
import {IOmittedArrayBindingElementDict} from "./array-binding-element-dict";
import {isIOmittedArrayBindingElementCtor} from "../../ctor/binding-element/is-i-omitted-array-binding-element-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IOmittedArrayBindingElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIOmittedArrayBindingElementDict (item: PredicateArgument): item is IOmittedArrayBindingElementDict {
	return isIOmittedArrayBindingElementCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.ARRAY_BINDING_ELEMENT;
}