import {ISignatureCtor} from "../../ctor/signature/i-signature-ctor";
import {IParameterDict} from "../parameter/i-parameter-dict";

export interface ISignatureDict extends ISignatureCtor {
	parameters: IParameterDict[]|null;
}