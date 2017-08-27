import {IClassAccessorFormatter} from "./i-class-accessor-formatter";
import {GetAccessorDeclaration, SetAccessorDeclaration} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedClassAccessor, FormattedExpressionKind} from "@wessberg/type";
import {ParameterTypeFormatterGetter} from "../../type/parameter-type-formatter/parameter-type-formatter-getter";
import {AccessorBaseFormatter} from "../accessor-base/accessor-base-formatter";
import {ClassElementFormatterGetter} from "../class-element/class-element-formatter-getter";
import {PropertyNameFormatterGetter} from "../property-name/property-name-formatter-getter";
import {FunctionLikeFormatterGetter} from "../function-like/function-like-formatter-getter";

/**
 * A class that can format GetAccessorDeclarations and SetAccessorDeclarations
 */
export class ClassAccessorFormatter extends AccessorBaseFormatter implements IClassAccessorFormatter {
	constructor (private classElementFormatter: ClassElementFormatterGetter,
							 astMapper: AstMapperGetter,
							 functionLikeFormatter: FunctionLikeFormatterGetter,
							 propertyNameFormatter: PropertyNameFormatterGetter,
							 parameterTypeFormatter: ParameterTypeFormatterGetter) {
		super(astMapper, functionLikeFormatter, propertyNameFormatter, parameterTypeFormatter);
	}

	/**
	 * Formats the given GetAccessorDeclaration|SetAccessorDeclaration into a FormattedClassAccessor
	 * @param {GetAccessorDeclaration|SetAccessorDeclaration} expression
	 * @returns {FormattedClassAccessor}
	 */
	public format (expression: GetAccessorDeclaration|SetAccessorDeclaration): FormattedClassAccessor {
		const result: FormattedClassAccessor = {
			...this.classElementFormatter().format(expression),
			...super.format(expression),
			expressionKind: FormattedExpressionKind.CLASS_ACCESSOR
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the FormattedClassAccessor
	 * @param {FormattedClassAccessor} formatted
	 * @returns {string}
	 */
	protected stringify (formatted: FormattedClassAccessor): string {
		return `${formatted.static ? "static " : ""}${super.stringify(formatted)}`;
	}

}