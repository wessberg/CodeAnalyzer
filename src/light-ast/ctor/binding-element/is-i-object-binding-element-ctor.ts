import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";
import {IObjectBindingElementCtor} from "./i-object-binding-element-ctor";

/**
 * Checks if the provided item is an INormalArrayBindingElementCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIObjectBindingElementCtor (item: PredicateArgument): item is IObjectBindingElementCtor {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"propertyName" in item &&
		"initializer" in item &&
		"isRestSpread" in item
	);
}