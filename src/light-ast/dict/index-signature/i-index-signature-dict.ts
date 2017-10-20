import {IIndexSignatureCtor} from "../../ctor/index-signature/i-index-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IIndexSignatureDict extends IIndexSignatureCtor, INodeDict {
	nodeKind: NodeKind.INDEX_SIGNATURE;
}