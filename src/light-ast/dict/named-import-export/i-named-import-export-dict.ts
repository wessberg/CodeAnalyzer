import {INamedImportExportCtor} from "../../ctor/named-import-export/i-named-import-export-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface INamedImportExportDict extends INamedImportExportCtor, INodeDict {
	nodeKind: "NAMED_IMPORT_EXPORT";
}