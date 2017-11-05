import {PropertyDeclaration} from "typescript";
import {INodeService} from "../node/i-node-service";
import {VisibilityKind} from "../../light-ast/dict/visibility/visibility-kind";

export interface IPropertyService extends INodeService<PropertyDeclaration> {
	getName (property: PropertyDeclaration): string;
	getTypeName (property: PropertyDeclaration): string|undefined;
	isOptional (property: PropertyDeclaration): boolean;
	isStatic (property: PropertyDeclaration): boolean;
	changeVisibility (visibility: VisibilityKind, property: PropertyDeclaration): PropertyDeclaration;
}