import {IIndexSignatureCtor} from "../../ctor/index-signature/i-index-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface IIndexSignatureDict extends IIndexSignatureCtor, INodeDict {
	nodeKind: "INDEX_SIGNATURE";
	parameters: IParameterDict[]|null;
}