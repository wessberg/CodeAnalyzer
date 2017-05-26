import {ArrowFunction, ConstructorDeclaration, FunctionDeclaration, MethodDeclaration} from "typescript";
import {IParameter} from "../../service/interface/ICodeAnalyzer";

export interface IParametersFormatter {
	format (declaration: ConstructorDeclaration|MethodDeclaration|FunctionDeclaration|ArrowFunction): IParameter[];
}