import {ITypeParameterFormatter} from "./i-type-parameter-formatter";
import {TypeParameterDeclaration} from "typescript";
import {FormattedExpressionKind, IFormattedTypeParameter} from "@wessberg/type";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for formatting IFormattedTypeParameters
 */
export class TypeParameterFormatter extends FormattedExpressionFormatter implements ITypeParameterFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private astUtil: ITypescriptASTUtil,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided TypeParameterDeclaration into an IFormattedTypeParameter
	 * @param {TypeParameterDeclaration} expression
	 * @returns {IFormattedTypeParameter}
	 */
	public format (expression: TypeParameterDeclaration): IFormattedTypeParameter {
		const typeParameter: IFormattedTypeParameter = {
			...super.format(expression),
			name: this.astUtil.takeName(expression.name),
			extends: expression.constraint == null ? undefined : this.typeFormatter().format(expression.constraint),
			initializer: expression.default == null ? undefined : this.typeFormatter().format(expression.default),
			expressionKind: FormattedExpressionKind.TYPE_PARAMETER
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(typeParameter, expression);

		// Override the 'toString()' method
		typeParameter.toString = () => this.stringify(typeParameter);
		return typeParameter;
	}

	/**
	 * Generates a string representation of the IFormattedTypeParameter
	 * @param {IFormattedTypeParameter} typeParameter
	 * @returns {string}
	 */
	private stringify (typeParameter: IFormattedTypeParameter): string {
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