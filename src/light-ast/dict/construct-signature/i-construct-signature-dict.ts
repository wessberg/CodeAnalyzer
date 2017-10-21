import {IConstructSignatureCtor} from "../../ctor/construct-signature/i-construct-signature-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IConstructSignatureDict extends IConstructSignatureCtor, INodeDict {
	nodeKind: "CONSTRUCT_SIGNATURE";
}