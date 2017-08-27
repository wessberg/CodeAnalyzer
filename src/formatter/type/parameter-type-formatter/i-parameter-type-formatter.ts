import {ParameterDeclaration} from "typescript";
import {ParameterType} from "@wessberg/type";

export interface IParameterTypeFormatter {
	format (member: ParameterDeclaration): ParameterType;
	stringify (parameterType: ParameterType): string;
}