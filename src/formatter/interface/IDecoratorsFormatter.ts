import {DecoratorIndexer} from "../../service/interface/ISimpleLanguageService";
import {PropertyDeclaration, ClassDeclaration, MethodDeclaration, ConstructorDeclaration, FunctionDeclaration, EnumDeclaration} from "typescript";

export interface IDecoratorsFormatter {
	format (declaration: PropertyDeclaration | ClassDeclaration | MethodDeclaration | ConstructorDeclaration | FunctionDeclaration | EnumDeclaration): DecoratorIndexer;
}