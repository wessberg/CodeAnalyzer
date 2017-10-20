import {INodeService} from "../node/i-node-service";
import {ParameterDeclaration} from "typescript";

export interface IParameterService extends INodeService<ParameterDeclaration> {
	getTypeName (parameter: ParameterDeclaration): string|undefined;
	isOptional (parameter: ParameterDeclaration): boolean;
	getName (parameter: ParameterDeclaration): string;
	getInitializer (parameter: ParameterDeclaration): string|undefined;
	hasInitializer (parameter: ParameterDeclaration): boolean;
	isRestSpread (parameter: ParameterDeclaration): boolean;
	isReadonly (parameter: ParameterDeclaration): boolean;
}