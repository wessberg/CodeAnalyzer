import {PredicateArgument} from "../node/i-node-dict";
import {INormalArrayBindingElementDict} from "./array-binding-element-dict";
import {ArrayBindingElementKind} from "./array-binding-element-kind";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";

/**
 * Checks if the provided item is an INormalArrayBindingElementDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINormalArrayBindingElementDict (item: PredicateArgument): item is INormalArrayBindingElementDict {
	return !isTypescriptNode(item) && item != null && (
		"kind" in item && item.kind === ArrayBindingElementKind.OMITTED &&
		"name" in item &&
		"isRestSpread" in item &&
		"initializer" in item
	);
}