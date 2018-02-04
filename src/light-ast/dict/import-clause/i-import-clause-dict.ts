import {IImportClauseCtor} from "../../ctor/import-clause/i-import-clause-ctor";
import {INodeDict} from "../node/i-node-dict";
import {INamedImportExportDict} from "../named-import-export/i-named-import-export-dict";

export interface IImportClauseDict extends IImportClauseCtor, INodeDict {
	nodeKind: "IMPORT_CLAUSE";
	namedImports: INamedImportExportDict[]|null;
}