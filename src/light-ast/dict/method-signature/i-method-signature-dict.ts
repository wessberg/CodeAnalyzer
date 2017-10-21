import {IMethodSignatureCtor} from "../../ctor/method-signature/i-method-signature-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IMethodSignatureDict extends IMethodSignatureCtor, INodeDict {
	nodeKind: "METHOD_SIGNATURE";
}