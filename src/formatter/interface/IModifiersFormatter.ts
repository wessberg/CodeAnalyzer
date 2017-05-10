import {ClassDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration, VariableDeclaration, VariableStatement} from "typescript";

export interface IModifiersFormatter {
	format (statement: VariableDeclaration | VariableStatement | PropertyDeclaration | MethodDeclaration | FunctionDeclaration | ClassDeclaration): Set<string>;
}