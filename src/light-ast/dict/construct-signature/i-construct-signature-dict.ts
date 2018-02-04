import {IConstructSignatureCtor} from "../../ctor/construct-signature/i-construct-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface IConstructSignatureDict extends IConstructSignatureCtor, INodeDict {
	nodeKind: "CONSTRUCT_SIGNATURE";
	parameters: IParameterDict[]|null;
}