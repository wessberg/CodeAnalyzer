import {PredicateArgument} from "../node/i-node-dict";
import {IArrayBindingNameDict} from "./binding-name-dict";
import {isIArrayBindingNameCtor} from "../../ctor/binding-name/is-i-array-binding-name-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IArrayBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIArrayBindingNameDict (item: PredicateArgument): item is IArrayBindingNameDict {
	return isIArrayBindingNameCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.BINDING_NAME;
}