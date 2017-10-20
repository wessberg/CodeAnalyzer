import {PredicateArgument} from "../node/i-node-dict";
import {IBindingNameDict} from "./binding-name-dict";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";
import {isIBindingNameCtor} from "../../ctor/binding-name/is-i-binding-name-ctor";

/**
 * Checks if the provided item is an IBindingNameDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIBindingNameDict (item: PredicateArgument): item is IBindingNameDict {
	return isIBindingNameCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.BINDING_NAME;
}