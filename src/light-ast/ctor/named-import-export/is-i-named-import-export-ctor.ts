import {isTypescriptNode} from "@wessberg/typescript-ast-util";
import {INamedImportExportCtor} from "./i-named-import-export-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an INamedImportExportCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINamedImportExportCtor (item: PredicateArgument): item is INamedImportExportCtor {
	return !isTypescriptNode(item) && item != null && (
		"name" in item &&
		"propertyName" in item
	);
}