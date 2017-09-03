import {IAccessorBaseFormatter} from "./i-accessor-base-formatter";
import {GetAccessorDeclaration, isGetAccessorDeclaration, SetAccessorDeclaration} from "typescript";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {FormattedAccessorBase, FormattedAccessorKind} from "@wessberg/type";
import {PropertyNameFormatterGetter} from "../property-name/property-name-formatter-getter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FunctionLikeFormatterGetter} from "../function-like/function-like-formatter-getter";
import {ParameterFormatterGetter} from "../parameter/parameter-formatter-getter";

/**
 * An abstract class that can format GetAccessorDeclarations and SetAccessorDeclarations
 */
export abstract class AccessorBaseFormatter extends FormattedExpressionFormatter implements IAccessorBaseFormatter {
	constructor (protected astMapper: AstMapperGetter,
							 private functionLikeFormatter: FunctionLikeFormatterGetter,
							 private propertyNameFormatter: PropertyNameFormatterGetter,
							 private parameterFormatter: ParameterFormatterGetter) {
		super();
	}

	/**
	 * Formats the given GetAccessorDeclaration|SetAccessorDeclaration into a FormattedBaseAccessor
	 * @param {GetAccessorDeclaration|SetAccessorDeclaration} expression
	 * @returns {FormattedAccessorBase}
	 */
	public format (expression: GetAccessorDeclaration|SetAccessorDeclaration): FormattedAccessorBase {
		const base = {
			...super.format(expression),
			...this.functionLikeFormatter().format(expression),
			name: this.propertyNameFormatter().format(expression.name)
		};
		let result: FormattedAccessorBase;

		if (isGetAccessorDeclaration(expression)) {
			result = {
				...base,
				kind: FormattedAccessorKind.GET
			};
		}

		else {
			result = {
				...base,
				kind: FormattedAccessorKind.SET,
				parameters: expression.parameters.map(parameter => this.parameterFormatter().format(parameter))
			};
		}

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the FormattedAccessorBase
	 * @param {FormattedAccessorBase} formatted
	 * @returns {string}
	 */
	protected stringify (formatted: FormattedAccessorBase): string {
		let str = "";
		// Add the accessor type
		str += formatted.kind === FormattedAccessorKind.GET ? "get " : "set ";
		// Add the name
		str += `${formatted.name.toString()} `;
		// Add the parameters
		str += formatted.kind === FormattedAccessorKind.GET ? "() " : `(${formatted.parameters.map(parameter => parameter.toString()).join(", ")}) `;
		// Add the body
		if (formatted.body != null) {
			// Add the opening bracket
			str += "{";
			str += formatted.body.toString();
			// Add the closing bracket
			str += "}";
		} else str += ";";
		return str;
	}

}