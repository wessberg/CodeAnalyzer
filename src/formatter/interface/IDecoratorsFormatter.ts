import {ArrowFunction, ClassDeclaration, ConstructorDeclaration, EnumDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, PropertyDeclaration, SetAccessorDeclaration} from "typescript";
import {IDecoratorIndexer} from "../../identifier/interface/IIdentifier";

export interface IDecoratorsFormatter {
	format (declaration: PropertyDeclaration|ClassDeclaration|MethodDeclaration|ConstructorDeclaration|FunctionDeclaration|EnumDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): IDecoratorIndexer;
}