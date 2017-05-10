import {IClassDeclaration, IEnumDeclaration, IFunctionDeclaration, IParameter, IParametersBody, IVariableAssignment} from "../../service/interface/ISimpleLanguageService";
export interface IIdentifierSerializer {
	serializeIParameter (parameter: IParameter): string;
	serializeIVariableAssignment (variableAssignment: IVariableAssignment): string;
	serializeIClassDeclaration (classDeclaration: IClassDeclaration, statics: boolean, identifier: string, scope: string | null): string;
	serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): string;
	serializeIParameterBody (parameterBody: IParametersBody): string;
	serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): string;
}