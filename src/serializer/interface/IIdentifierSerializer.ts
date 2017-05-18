import {IClassDeclaration, IEnumDeclaration, IFunctionDeclaration, ImportExportBindingPayload, IParameter, IParametersBody, IVariableAssignment} from "../../service/interface/ICodeAnalyzer";

export declare type ReplacementPositions = { [key: string]: [number, number] };

export interface IIdentifierSerializer {
	serializeIParameter (parameter: IParameter): [string, ReplacementPositions];
	serializeIVariableAssignment (variableAssignment: IVariableAssignment): [string, ReplacementPositions];
	serializeIImportExportBinding (payload: ImportExportBindingPayload): [string, ReplacementPositions];
	serializeIClassDeclaration (classDeclaration: IClassDeclaration): [string, ReplacementPositions];
	serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): [string, ReplacementPositions];
	serializeIParameterBody (parameterBody: IParametersBody): [string, ReplacementPositions];
	serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): [string, ReplacementPositions];
}