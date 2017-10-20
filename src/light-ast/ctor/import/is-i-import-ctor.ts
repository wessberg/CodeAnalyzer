import {IImportCtor} from "./i-import-ctor";
import {isIImportClauseCtor} from "../import-clause/is-i-import-clause-ctor";
import {PredicateArgument} from "../../dict/node/i-node-dict";

/**
 * Checks if the provided item is an IImportCtor
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImportCtor (item: PredicateArgument): item is IImportCtor {
	return isIImportClauseCtor(item) && (
		"path" in item
	);
}