import {ClassDeclaration, ConstructorDeclaration, EnumDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration} from "typescript";
import {DecoratorIndexer} from "../../service/interface/ISimpleLanguageService";

export interface IDecoratorsFormatter {
	format (declaration: PropertyDeclaration | ClassDeclaration | MethodDeclaration | ConstructorDeclaration | FunctionDeclaration | EnumDeclaration): DecoratorIndexer;
}