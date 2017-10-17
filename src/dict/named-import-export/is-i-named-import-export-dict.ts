import {PredicateArgument} from "../node/i-node-dict";
import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {INamedImportExportDict} from "./i-named-import-export-dict";

/**
 * Checks if the provided item is an INamedImportExportDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINamedImportExportDict (item: PredicateArgument): item is INamedImportExportDict {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"propertyName" in item
	);
}