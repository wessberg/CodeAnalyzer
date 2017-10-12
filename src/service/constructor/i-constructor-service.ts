import {ConstructorDeclaration} from "typescript";

export interface IConstructorService {
	appendInstructionsToConstructor (instructions: string, constructor: ConstructorDeclaration): ConstructorDeclaration;
}