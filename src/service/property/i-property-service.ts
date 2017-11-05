import {PropertyDeclaration} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface IPropertyService extends INodeService<PropertyDeclaration> {
	getName (property: PropertyDeclaration): string;
	getTypeName (property: PropertyDeclaration): string|undefined;
	isOptional (property: PropertyDeclaration): boolean;
	isStatic (property: PropertyDeclaration): boolean;
}