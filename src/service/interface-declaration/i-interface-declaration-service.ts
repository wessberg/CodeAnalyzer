import {ITypeDeclarationService} from "../type-declaration/i-type-declaration-service";
import {InterfaceDeclaration} from "typescript";

export interface IInterfaceDeclarationService extends ITypeDeclarationService<InterfaceDeclaration> {
	getName (type: InterfaceDeclaration): string;
}