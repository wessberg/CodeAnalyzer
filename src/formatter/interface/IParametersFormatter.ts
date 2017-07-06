import {ArrowFunction, ConstructorDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, SetAccessorDeclaration} from "typescript";
import {IParameter} from "../../identifier/interface/IIdentifier";

export interface IParametersFormatter {
	format (declaration: ConstructorDeclaration|MethodDeclaration|FunctionDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): IParameter[];
}