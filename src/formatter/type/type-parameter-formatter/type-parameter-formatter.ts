import {ITypeParameterFormatter} from "./i-type-parameter-formatter";
import {NodeArray, TypeParameterDeclaration} from "typescript";
import {ITypeParameter} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for formatting ITypeParameters
 */
export class TypeParameterFormatter implements ITypeParameterFormatter {
	constructor (private astUtil: ITypescriptASTUtil,
							 private typeFormatter: TypeFormatterGetter) {
	}

	/**
	 * Formats the provided NodeArray of TypeParameterDeclarations into an array of ITypeParameter
	 * @param {NodeArray<TypeParameterDeclaration>} statements
	 * @returns {ITypeParameter[]}
	 */
	public format (statements: NodeArray<TypeParameterDeclaration>): ITypeParameter[] {
		return statements.map(statement => this.formatTypeParameter(statement));
	}

	/**
	 * Formats the provided TypeParameterDeclaration into an ITypeParameter
	 * @param {ts.TypeParameterDeclaration} statement
	 * @returns {ITypeParameter}
	 */
	private formatTypeParameter (statement: TypeParameterDeclaration): ITypeParameter {
		const typeParameter = {
			name: this.astUtil.takeName(statement.name),
			extends: statement.constraint == null ? undefined : this.typeFormatter().format(statement.constraint),
			initializer: statement.default == null ? undefined : this.typeFormatter().format(statement.default)
		};

		// Override the 'toString()' method
		typeParameter.toString = () => this.stringify(typeParameter);
		return typeParameter;
	}

	/**
	 * Generates a string representation of the ITypeParameter
	 * @param {ITypeParameter} typeParameter
	 * @returns {string}
	 */
	private stringify (typeParameter: ITypeParameter): string {
		let str = "";
		// Add the name first
		str += typeParameter.name;

		// Add the 'extends' constraint to the type parameter
		if (typeParameter.extends != null) {
			str += ` extends ${typeParameter.extends.toString()}`;
		}

		// Add the initializer/default generic type to the type parameter
		if (typeParameter.initializer != null) {
			str += ` = ${typeParameter.initializer.toString()}`;
		}
		return str;
	}
}