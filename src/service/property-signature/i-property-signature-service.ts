import {PropertySignature} from "typescript";

export interface IPropertySignatureService {
	getTypeName (propertySignature: PropertySignature): string|undefined;
	getExpression (propertySignature: PropertySignature): string|undefined;
}