import {ConstructorDeclaration} from "typescript";
import {INodeService} from "../node/i-node-service";
import {IParameterCtor} from "../../light-ast/ctor/parameter/i-parameter-ctor";
import {IPlacement} from "../../placement/i-placement";

export interface IConstructorService extends INodeService<ConstructorDeclaration> {
	appendInstructions (instructions: string, constructor: ConstructorDeclaration): ConstructorDeclaration;
	prependInstructions (instructions: string, constructor: ConstructorDeclaration): ConstructorDeclaration;
	getParameterTypeNames (constructor: ConstructorDeclaration): (string|undefined)[];
	getNonInitializedTypeNames (constructor: ConstructorDeclaration): (string|undefined)[];
	addParameter (parameter: IParameterCtor, constructor: ConstructorDeclaration, placement?: IPlacement): ConstructorDeclaration;
}