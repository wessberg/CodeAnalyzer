import {PropertyDeclaration} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface IPropertyService extends INodeService<PropertyDeclaration> {
	getTypeName (property: PropertyDeclaration): string|undefined;
	isOptional (property: PropertyDeclaration): boolean;
}