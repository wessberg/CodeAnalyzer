import {IImportCtor} from "../../ctor/import/i-import-ctor";
import {INodeDict} from "../node/i-node-dict";
import {INamedImportExportDict} from "../named-import-export/i-named-import-export-dict";

export interface IImportDict extends IImportCtor, INodeDict {
	nodeKind: "IMPORT";
	namedImports: INamedImportExportDict[]|null;
}