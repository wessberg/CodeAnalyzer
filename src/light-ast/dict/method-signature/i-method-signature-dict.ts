import {IMethodSignatureCtor} from "../../ctor/method-signature/i-method-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IMethodSignatureDict extends IMethodSignatureCtor, INodeDict {
	nodeKind: NodeKind.METHOD_SIGNATURE;
}