import {MethodSignature} from "typescript";

export interface IMethodSignatureService {
	getTypeName (methodSignature: MethodSignature): string|undefined;
	getName (methodSignature: MethodSignature): string;
}