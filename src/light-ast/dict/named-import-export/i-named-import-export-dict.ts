import {INamedImportExportCtor} from "../../ctor/named-import-export/i-named-import-export-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface INamedImportExportDict extends INamedImportExportCtor, INodeDict {
	nodeKind: NodeKind.NAMED_IMPORT_EXPORT;
}