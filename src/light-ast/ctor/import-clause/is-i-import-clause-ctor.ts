import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {IImportClauseCtor} from "./i-import-clause-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IImportClauseCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImportClauseCtor (item: PredicateArgument): item is IImportClauseCtor {
	return !isTypescriptNode(item) && item != null && (
		"namedImports" in item &&
		"namespace" in item &&
		"defaultName" in item
	);
}