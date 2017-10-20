import {ICallSignatureCtor} from "../../ctor/call-signature/i-call-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface ICallSignatureDict extends ICallSignatureCtor, INodeDict {
	nodeKind: NodeKind.CALL_SIGNATURE;
}