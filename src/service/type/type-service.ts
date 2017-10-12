import {ITypeService} from "./i-type-service";
import {AccessorDeclaration, CallExpression, ExpressionWithTypeArguments, isTypeNode, MethodDeclaration, ParameterDeclaration, PropertyDeclaration, TypeNode, TypeParameterDeclaration, VariableDeclaration} from "typescript";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IPrinter} from "@wessberg/typescript-ast-util";

/**
 * A service for working with Types
 */
export class TypeService implements ITypeService {

	constructor (private formatter: IFormatter,
							 private printer: IPrinter) {
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
	 * Creates a TypeParameterDeclaration from the provided string representation of it
	 * @param {string} type
	 * @returns {TypeParameterDeclaration}
	 */
	public createTypeParameterDeclaration (type: string): TypeParameterDeclaration {
		return this.formatter.formatTypeParameter(type);
	}

	/**
	 * Creates a TypeNode from the provided string representation of it
	 * @param {string} type
	 * @returns {TypeNode}
	 */
	public createTypeNode (type: string): TypeNode {
		return this.formatter.formatType(type);
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