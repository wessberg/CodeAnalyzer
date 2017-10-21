import {ICallSignatureCtor} from "../../ctor/call-signature/i-call-signature-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface ICallSignatureDict extends ICallSignatureCtor, INodeDict {
	nodeKind: "CALL_SIGNATURE";
}