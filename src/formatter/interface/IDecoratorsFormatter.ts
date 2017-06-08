import {ArrowFunction, ClassDeclaration, ConstructorDeclaration, EnumDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, PropertyDeclaration, SetAccessorDeclaration} from "typescript";
import {DecoratorIndexer} from "../../service/interface/ICodeAnalyzer";

export interface IDecoratorsFormatter {
	format (declaration: PropertyDeclaration|ClassDeclaration|MethodDeclaration|ConstructorDeclaration|FunctionDeclaration|EnumDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): DecoratorIndexer;
}