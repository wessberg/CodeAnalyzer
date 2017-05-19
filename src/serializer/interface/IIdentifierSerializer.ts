import {IClassDeclaration, IEnumDeclaration, IFunctionDeclaration, ImportExportBindingPayload, IParameter, IParametersBody, IVariableAssignment} from "../../service/interface/ICodeAnalyzer";

export declare type SerializedVersions = string[];
export declare type SerializedReplacements = { [key: string]: string };

export interface IIdentifierSerializer {
	serializeIParameter (parameter: IParameter): SerializedVersions;
	serializeIVariableAssignment (variableAssignment: IVariableAssignment): SerializedVersions;
	serializeIImportExportBinding (payload: ImportExportBindingPayload): SerializedVersions;
	serializeIClassDeclaration (classDeclaration: IClassDeclaration): SerializedVersions;
	serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): SerializedVersions;
	serializeIParameterBody (parameterBody: IParametersBody): SerializedVersions;
	serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): SerializedVersions;
}