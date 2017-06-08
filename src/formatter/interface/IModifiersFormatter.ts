import {ArrowFunction, ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, PropertyDeclaration, SetAccessorDeclaration, VariableDeclaration, VariableStatement} from "typescript";

export interface IModifiersFormatter {
	format (statement: VariableDeclaration|VariableStatement|PropertyDeclaration|MethodDeclaration|FunctionDeclaration|ClassDeclaration|ConstructorDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): Set<string>;
}