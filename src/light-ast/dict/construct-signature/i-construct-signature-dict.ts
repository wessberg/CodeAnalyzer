import {IConstructSignatureCtor} from "../../ctor/construct-signature/i-construct-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IConstructSignatureDict extends IConstructSignatureCtor, INodeDict {
	nodeKind: NodeKind.CONSTRUCT_SIGNATURE;
}