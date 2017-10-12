import {AccessorDeclaration, CallExpression, ExpressionWithTypeArguments, MethodDeclaration, ParameterDeclaration, PropertyDeclaration, TypeNode, TypeParameterDeclaration, VariableDeclaration} from "typescript";

export interface ITypeService {
	createTypeNode (type: string): TypeNode;
	createTypeParameterDeclaration (type: string): TypeParameterDeclaration;
	getTypeNameOf (node: ParameterDeclaration|AccessorDeclaration|PropertyDeclaration|MethodDeclaration|VariableDeclaration|TypeNode|ExpressionWithTypeArguments): string|undefined;
	getTypeArgumentNamesOfExpression (node: CallExpression): string[];
}