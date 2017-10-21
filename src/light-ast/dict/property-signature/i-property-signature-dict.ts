import {IPropertySignatureCtor} from "../../ctor/property-signature/i-property-signature-ctor";
import {INodeDict} from "../node/i-node-dict";

export interface IPropertySignatureDict extends IPropertySignatureCtor, INodeDict {
	nodeKind: "PROPERTY_SIGNATURE";
}