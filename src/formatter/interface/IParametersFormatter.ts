import {ArrowFunction, ConstructorDeclaration, FunctionDeclaration, GetAccessorDeclaration, MethodDeclaration, SetAccessorDeclaration} from "typescript";
import {IParameter} from "../../service/interface/ICodeAnalyzer";

export interface IParametersFormatter {
	format (declaration: ConstructorDeclaration|MethodDeclaration|FunctionDeclaration|ArrowFunction|GetAccessorDeclaration|SetAccessorDeclaration): IParameter[];
}