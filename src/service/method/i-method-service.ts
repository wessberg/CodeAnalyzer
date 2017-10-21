import {MethodDeclaration} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface IMethodService extends INodeService<MethodDeclaration> {
	appendInstructions (instructions: string, method: MethodDeclaration): MethodDeclaration;
	getTypeName (method: MethodDeclaration): string|undefined;
	isOptional (method: MethodDeclaration): boolean;
}