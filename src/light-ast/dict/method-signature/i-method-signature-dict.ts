import {IMethodSignatureCtor} from "../../ctor/method-signature/i-method-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface IMethodSignatureDict extends IMethodSignatureCtor, INodeDict {
	nodeKind: "METHOD_SIGNATURE";
	parameters: IParameterDict[]|null;
}