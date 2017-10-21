import {MethodDeclaration, ReturnStatement} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface IMethodService extends INodeService<MethodDeclaration> {
	appendInstructions (instructions: string, method: MethodDeclaration): MethodDeclaration;
	takeReturnStatement (method: MethodDeclaration): ReturnStatement|undefined;
	getTypeName (method: MethodDeclaration): string|undefined;
	isOptional (method: MethodDeclaration): boolean;
}