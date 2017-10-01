import {TypeNode, TypeParameterDeclaration} from "typescript";

export interface ITypeService {
	createTypeNode (type: string): TypeNode;
	createTypeParameterDeclaration (type: string): TypeParameterDeclaration;
}