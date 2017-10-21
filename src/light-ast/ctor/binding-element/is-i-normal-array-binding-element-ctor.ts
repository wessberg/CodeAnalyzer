import {INormalArrayBindingElementCtor} from "./array-binding-element-ctor";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an INormalArrayBindingElementCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalArrayBindingElementCtor (item: PredicateArgument): item is INormalArrayBindingElementCtor {
	return !isTypescriptNode(item) && item != null && (
		"kind" in item && item.kind === "OMITTED" &&
		"name" in item &&
		"isRestSpread" in item &&
		"initializer" in item
	);
}