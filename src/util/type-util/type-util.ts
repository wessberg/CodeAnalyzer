import {ITypeUtil} from "./i-type-util";
import {IPrinter} from "@wessberg/typescript-ast-util";
import {AccessorDeclaration, CallExpression, ExpressionWithTypeArguments, isTypeNode, MethodDeclaration, ParameterDeclaration, PropertyDeclaration, TypeNode, VariableDeclaration} from "typescript";

/**
 * A utility class for working with TypeNodes
 */
export class TypeUtil implements ITypeUtil {
	constructor (private printer: IPrinter) {
	}

	/**
	 * Gets the (string) name of a type
	 * @param {ParameterDeclaration | AccessorDeclaration | PropertyDeclaration | MethodDeclaration | VariableDeclaration | TypeNode | ExpressionWithTypeArguments} node
	 * @returns {string}
	 */
	public getTypeNameOf (node: ParameterDeclaration|AccessorDeclaration|PropertyDeclaration|MethodDeclaration|VariableDeclaration|TypeNode|ExpressionWithTypeArguments): string|undefined {
		if (isTypeNode(node)) return this.printer.print(node);

		return node.type == null ? undefined : this.printer.print(node.type);
	}

	/**
	 * Gets the names of the Type arguments provided to an expression
	 * @param {CallExpression} node
	 * @returns {string[]}
	 */
	public getTypeArgumentNamesOfExpression (node: CallExpression): string[] {
		return node.typeArguments == null ? [] : node.typeArguments.map(argument => this.printer.print(argument));
	}
}