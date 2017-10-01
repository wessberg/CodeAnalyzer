import {PredicateArgument} from "../node/i-node-dict";
import {IImportDict} from "./i-import-dict";
import {isTypescriptNode} from "../typescript-node/is-typescript-node";

/**
 * Checks if the provided item is an IImportDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImportDict (item: PredicateArgument): item is IImportDict {
	return !isTypescriptNode(item) && item != null && (
		"path" in item &&
		"namedImports" in item &&
		"namespace" in item &&
		"defaultName" in item
	);
}