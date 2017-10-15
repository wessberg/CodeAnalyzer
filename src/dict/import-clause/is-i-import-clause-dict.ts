import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {PredicateArgument} from "../node/i-node-dict";
import {IImportClauseDict} from "./i-import-clause-dict";

/**
 * Checks if the provided item is an IImportClauseDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImportClauseDict (item: PredicateArgument): item is IImportClauseDict {
	return !isTypescriptNode(item) && item != null && (
		"namedImports" in item &&
		"namespace" in item &&
		"defaultName" in item
	);
}