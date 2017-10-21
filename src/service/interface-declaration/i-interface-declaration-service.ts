import {ITypeDeclarationService} from "../type-declaration/i-type-declaration-service";
import {InterfaceDeclaration, SourceFile} from "typescript";
import {IInterfaceDict} from "../../light-ast/dict/interface/i-interface-dict";

export interface IInterfaceDeclarationService extends ITypeDeclarationService<InterfaceDeclaration> {
	getName (type: InterfaceDeclaration): string;
	hasInterfaceWithName (name: string, sourceFile: SourceFile, deep?: boolean): boolean;
	getInterfaceWithName (name: string, sourceFile: SourceFile, deep?: boolean): InterfaceDeclaration|undefined;
	getTypeParameterNames (type: InterfaceDeclaration): string[]|undefined;
	toLightAST (type: InterfaceDeclaration): IInterfaceDict;
}