import {IIndexSignatureCtor} from "../../ctor/index-signature/i-index-signature-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IIndexSignatureDict extends IIndexSignatureCtor, INodeDict {
	nodeKind: "INDEX_SIGNATURE";
}