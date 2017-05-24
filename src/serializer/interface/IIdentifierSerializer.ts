import {ArbitraryValue, IClassDeclaration, IEnumDeclaration, IFunctionDeclaration, IIdentifier, ILiteralValue, IParameter, IParametersBody, IVariableAssignment} from "../../service/interface/ICodeAnalyzer";

export declare type SerializedVersions = string[];
export declare type SerializedReplacements = { [key: string]: string };

export interface IIdentifierSerializer {
	serialize (value: IIdentifier|ArbitraryValue): SerializedVersions;
	serializeIParameter (parameter: IParameter): SerializedVersions;
	serializeIVariableAssignment (variableAssignment: IVariableAssignment): SerializedVersions;
	serializeIIdentifier (identifier: IIdentifier): SerializedVersions;
	serializeArbitrary (value: ArbitraryValue): SerializedVersions;
	serializeILiteralValue (literal: ILiteralValue): SerializedVersions;
	serializeIClassDeclaration (classDeclaration: IClassDeclaration): SerializedVersions;
	serializeIEnumDeclaration (enumDeclaration: IEnumDeclaration): SerializedVersions;
	serializeIParameterBody (parameterBody: IParametersBody): SerializedVersions;
	serializeIFunctionDeclaration (functionDeclaration: IFunctionDeclaration): SerializedVersions;
}