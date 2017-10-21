import {IBindingNameCtor} from "./binding-name-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IBindingNameCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIBindingNameCtor (item: PredicateArgument): item is IBindingNameCtor {
	return !isTypescriptNode(item) && item != null && "kind" in item;
}