import {PredicateArgument} from "../node/i-node-dict";
import {IImportClauseDict} from "./i-import-clause-dict";
import {isIImportClauseCtor} from "../../ctor/import-clause/is-i-import-clause-ctor";
import {isINodeDict} from "../node/is-i-node-dict";
import {NodeKind} from "../node/node-kind";

/**
 * Checks if the provided item is an IImportClauseDict
 * @param {PredicateArgument} item
 * @returns {boolean}
 */
export function isIImportClauseDict (item: PredicateArgument): item is IImportClauseDict {
	return isIImportClauseCtor(item) && isINodeDict(item) && item.nodeKind === NodeKind.IMPORT_CLAUSE;
}