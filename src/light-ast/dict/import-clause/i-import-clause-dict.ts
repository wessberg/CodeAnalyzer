import {IImportClauseCtor} from "../../ctor/import-clause/i-import-clause-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IImportClauseDict extends IImportClauseCtor, INodeDict {
	nodeKind: NodeKind.IMPORT_CLAUSE;
}