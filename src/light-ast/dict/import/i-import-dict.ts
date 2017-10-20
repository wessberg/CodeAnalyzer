import {IImportCtor} from "../../ctor/import/i-import-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IImportDict extends IImportCtor, INodeDict {
	nodeKind: NodeKind.IMPORT;
}