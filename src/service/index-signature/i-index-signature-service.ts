import {IndexSignatureDeclaration} from "typescript";

export interface IIndexSignatureService {
	getTypeName (indexSignature: IndexSignatureDeclaration): string|undefined;
	getName (indexSignature: IndexSignatureDeclaration): string|undefined;
}