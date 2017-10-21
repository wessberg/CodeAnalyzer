import {IImportClauseCtor} from "../../ctor/import-clause/i-import-clause-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IImportClauseDict extends IImportClauseCtor, INodeDict {
	nodeKind: "IMPORT_CLAUSE";
}