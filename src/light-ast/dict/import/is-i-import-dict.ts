import {PredicateArgument} from "../node/i-node-dict";
import {IImportDict} from "./i-import-dict";
import {isIImportCtor} from "../../ctor/import/is-i-import-ctor";
import {isINodeDict} from "../node/is-i-node-dict";

/**
 * Checks if the provided item is an IImportDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImportDict (item: PredicateArgument): item is IImportDict {
	return isIImportCtor(item) && isINodeDict(item) && item.nodeKind === "IMPORT";
}