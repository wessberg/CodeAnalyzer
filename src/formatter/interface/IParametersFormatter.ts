import {IParameter} from "../../service/interface/ISimpleLanguageService";
import {ConstructorDeclaration, MethodDeclaration, FunctionDeclaration} from "typescript";

export interface IParametersFormatter {
	format (declaration: ConstructorDeclaration | MethodDeclaration | FunctionDeclaration): IParameter[];
}