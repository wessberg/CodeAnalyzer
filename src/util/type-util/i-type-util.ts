import {AccessorDeclaration, CallExpression, ExpressionWithTypeArguments, MethodDeclaration, ParameterDeclaration, PropertyDeclaration, TypeNode, VariableDeclaration} from "typescript";

export interface ITypeUtil {
	getTypeNameOf (node: ParameterDeclaration|AccessorDeclaration|PropertyDeclaration|MethodDeclaration|VariableDeclaration|TypeNode|ExpressionWithTypeArguments): string|undefined;
	getTypeArgumentNamesOfExpression (node: CallExpression): string[];
}