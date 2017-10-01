import {PredicateArgument} from "../node/i-node-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";
import {INamedImportDict} from "./i-named-import-dict";

/**
 * Checks if the provided item is an INamedImportDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINamedImportDict (item: PredicateArgument): item is INamedImportDict {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"propertyName" in item
	);
}