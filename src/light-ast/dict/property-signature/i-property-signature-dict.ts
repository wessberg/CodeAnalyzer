import {IPropertySignatureCtor} from "../../ctor/property-signature/i-property-signature-ctor";
import {INodeDict} from "../node/i-node-dict";
import {NodeKind} from "../node/node-kind";

export interface IPropertySignatureDict extends IPropertySignatureCtor, INodeDict {
	nodeKind: NodeKind.PROPERTY_SIGNATURE;
}