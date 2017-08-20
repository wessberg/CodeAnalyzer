import {ITypeParameter} from "@wessberg/type";
import {NodeArray, TypeParameterDeclaration} from "typescript";

export interface ITypeParameterFormatter {
	format (statements: NodeArray<TypeParameterDeclaration>): ITypeParameter[];
}