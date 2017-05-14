import {IClassDeclaration, IEnumDeclaration, IFunctionDeclaration, IImportExportBinding, IParameter, IParametersBody, IVariableAssignment} from "../../service/interface/ISimpleLanguageService";
export interface IIdentifierSerializer {
	serializeIParameter (parameter: IParameter): string;
	serializeIVariableAssignment (variableAssignment: IVariableAssignment): string;
	serializeIImportExportBinding (binding: IImportExportBinding): string;
	serializeIClassDeclaration (classDeclaration: IClassDeclaration, statics: boolean): string;
	serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): string;
	serializeIParameterBody (parameterBody: IParametersBody): string;
	serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): string;
}