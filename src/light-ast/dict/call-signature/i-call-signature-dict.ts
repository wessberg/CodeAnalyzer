import {ICallSignatureCtor} from "../../ctor/call-signature/i-call-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface ICallSignatureDict extends ICallSignatureCtor, INodeDict {
	nodeKind: "CALL_SIGNATURE";
	parameters: IParameterDict[]|null;
}