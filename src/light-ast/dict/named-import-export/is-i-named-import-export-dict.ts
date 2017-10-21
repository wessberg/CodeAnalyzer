import {PredicateArgument} from "../node/i-node-dict";
import {INamedImportExportDict} from "./i-named-import-export-dict";
import {isINamedImportExportCtor} from "../../ctor/named-import-export/is-i-named-import-export-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an INamedImportExportDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isINamedImportExportDict (item: PredicateArgument): item is INamedImportExportDict {
	return isINamedImportExportCtor(item) && isINodeDict(item) && item.nodeKind === "NAMED_IMPORT_EXPORT";
}