import {ConstructorDeclaration} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface IConstructorService extends INodeService<ConstructorDeclaration> {
	appendInstructions (instructions: string, constructor: ConstructorDeclaration): ConstructorDeclaration;
}