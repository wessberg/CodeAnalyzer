import {IParameterFormatter} from "./i-parameter-formatter";
import {isArrayBindingPattern, isObjectBindingPattern, ParameterDeclaration} from "typescript";
import {FormattedExpressionKind, FormattedParameter, BindingNameKind} from "@wessberg/type";
import {ExpressionFormatterGetter} from "../expression/expression-formatter-getter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {TypeFormatterGetter} from "../../type/type-formatter/type-formatter-getter";
import {ArrayBindingNameFormatterGetter} from "../../binding-name/array-binding-name-formatter/array-binding-name-formatter-getter";
import {ObjectBindingNameFormatterGetter} from "../../binding-name/object-binding-name-formatter/object-binding-name-formatter-getter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class that can format parameters
 */
export class ParameterFormatter extends FormattedExpressionFormatter implements IParameterFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private astUtil: ITypescriptASTUtil,
							 private objectBindingNameFormatter: ObjectBindingNameFormatterGetter,
							 private arrayBindingNameFormatter: ArrayBindingNameFormatterGetter,
							 private typeFormatter: TypeFormatterGetter,
							 private expressionFormatter: ExpressionFormatterGetter) {
		super();
	}

	/**
	 * Formats the given ParameterDeclaration into a FormattedParameter
	 * @param {ParameterDeclaration} expression
	 * @returns {FormattedParameter}
	 */
	public format (expression: ParameterDeclaration): FormattedParameter {

		const base = {
			...super.format(expression),
			isRestSpread: expression.dotDotDotToken != null,
			optional: expression.questionToken != null,
			initializer: expression.initializer == null ? null : this.expressionFormatter().format(expression.initializer),
			type: this.typeFormatter().format(expression.type)
		};

		let result: FormattedParameter;

		if (isObjectBindingPattern(expression.name)) {
			result = {
				...base,
				kind: BindingNameKind.OBJECT_BINDING,
				bindings: expression.name.elements.map(element => this.objectBindingNameFormatter().format(element)),
				expressionKind: FormattedExpressionKind.PARAMETER
			};
		}

		else if (isArrayBindingPattern(expression.name)) {
			result = {
				...base,
				kind: BindingNameKind.ARRAY_BINDING,
				bindings: expression.name.elements.map((element, index) => this.arrayBindingNameFormatter().format(element, index)),
				expressionKind: FormattedExpressionKind.PARAMETER
			};
		}

		else {
			result = {
				...base,
				kind: BindingNameKind.NORMAL,
				name: this.astUtil.takeName(expression.name),
				expressionKind: FormattedExpressionKind.PARAMETER
			};
		}

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the FormattedParameter
	 * @param {FormattedParameter} formatted
	 * @returns {string}
	 */
	private stringify (formatted: FormattedParameter): string {
		let str = "";
		if (formatted.isRestSpread) str += "...";
		switch (formatted.kind) {

			case BindingNameKind.NORMAL:
				str += formatted.name;
				break;

			case BindingNameKind.ARRAY_BINDING:
				str += `[${formatted.bindings.map(binding => binding.toString()).join(", ")}]`;
				break;

			case BindingNameKind.OBJECT_BINDING:
				str += `{${formatted.bindings.map(binding => binding.toString()).join(", ")}}`;
				break;
		}
		// Add a '?' at the end of the parameter if it is optional

		if (formatted.optional) str += "?";
		str += ": ";
		str += formatted.type.toString();

		// Add the initializer value if it has one
		if (formatted.initializer != null) {
			str += ` = ${formatted.initializer.toString()}`;
		}

		return str;
	}
}