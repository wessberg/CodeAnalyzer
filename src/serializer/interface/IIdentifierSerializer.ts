import {IClassDeclaration, IEnumDeclaration, IFunctionDeclaration, ImportExportBindingPayload, IParameter, IParametersBody, IVariableAssignment} from "../../service/interface/ICodeAnalyzer";
export interface IIdentifierSerializer {
	serializeIParameter (parameter: IParameter): string;
	serializeIVariableAssignment (variableAssignment: IVariableAssignment): string;
	serializeIImportExportBinding (payload: ImportExportBindingPayload): string;
	serializeIClassDeclaration (classDeclaration: IClassDeclaration, statics: boolean): string;
	serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): string;
	serializeIParameterBody (parameterBody: IParametersBody): string;
	serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): string;
}