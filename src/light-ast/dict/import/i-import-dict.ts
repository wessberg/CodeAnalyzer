import {IImportCtor} from "../../ctor/import/i-import-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IImportDict extends IImportCtor, INodeDict {
	nodeKind: "IMPORT";
}