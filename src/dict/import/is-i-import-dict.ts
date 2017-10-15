import {PredicateArgument} from "../node/i-node-dict";
import {IImportDict} from "./i-import-dict";
import {isIImportClauseDict} from "../import-clause/is-i-import-clause-dict";

/**
 * Checks if the provided item is an IImportDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImportDict (item: PredicateArgument): item is IImportDict {
	return isIImportClauseDict(item) && (
		"path" in item
	);
}