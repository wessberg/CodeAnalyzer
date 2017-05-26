import {ArrowFunction, ClassDeclaration, ConstructorDeclaration, EnumDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration} from "typescript";
import {DecoratorIndexer} from "../../service/interface/ICodeAnalyzer";

export interface IDecoratorsFormatter {
	format (declaration: PropertyDeclaration|ClassDeclaration|MethodDeclaration|ConstructorDeclaration|FunctionDeclaration|EnumDeclaration|ArrowFunction): DecoratorIndexer;
}