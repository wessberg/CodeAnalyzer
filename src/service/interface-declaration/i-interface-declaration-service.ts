import {ITypeDeclarationService} from "../type-declaration/i-type-declaration-service";
import {InterfaceDeclaration} from "typescript";
import {IInterfaceDict} from "../../light-ast/dict/interface/i-interface-dict";

export interface IInterfaceDeclarationService extends ITypeDeclarationService<InterfaceDeclaration> {
	getName (type: InterfaceDeclaration): string;
	getTypeParameterNames (type: InterfaceDeclaration): string[]|undefined;
	toInterfaceDict (type: InterfaceDeclaration): IInterfaceDict;
}