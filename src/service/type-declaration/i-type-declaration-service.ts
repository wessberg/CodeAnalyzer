import {InterfaceDeclaration, TypeLiteralNode} from "typescript";
import {INodeService} from "../node/i-node-service";

export interface ITypeDeclarationService<T extends InterfaceDeclaration|TypeLiteralNode> extends INodeService<T> {
	getPropertyNamesOfTypeDeclaration (type: T): string[];
	getRequiredPropertyNamesOfTypeDeclaration (type: T): string[];
	getOptionalPropertyNamesOfTypeDeclaration (type: T): string[];
}