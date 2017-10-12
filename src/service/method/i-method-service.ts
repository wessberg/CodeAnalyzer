import {MethodDeclaration} from "typescript";

export interface IMethodService {
	appendInstructionsToMethod (instructions: string, method: MethodDeclaration): MethodDeclaration;
}