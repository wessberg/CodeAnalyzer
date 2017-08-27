import {IFunctionFormatter} from "./i-function-formatter";
import {ArrowFunction, FunctionDeclaration, FunctionExpression, isArrowFunction, isBlock, SyntaxKind} from "typescript";
import {FormattedExpressionKind, FormattedFunction, FormattedFunctionKind} from "@wessberg/type";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {FunctionLikeFormatterGetter} from "../function-like/function-like-formatter-getter";
import {TypeParameterFormatterGetter} from "../../type/type-parameter-formatter/type-parameter-formatter-getter";
import {DecoratorFormatterGetter} from "../decorator/decorator-formatter-getter";
import {PropertyNameFormatterGetter} from "../property-name/property-name-formatter-getter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {ParameterFormatterGetter} from "../parameter/parameter-formatter-getter";

/**
 * A class that can format Functions
 */
export class FunctionFormatter extends FormattedExpressionFormatter implements IFunctionFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private functionLikeFormatter: FunctionLikeFormatterGetter,
							 private propertyNameFormatter: PropertyNameFormatterGetter,
							 private decoratorFormatter: DecoratorFormatterGetter,
							 private parameterFormatter: ParameterFormatterGetter,
							 private typeParameterFormatter: TypeParameterFormatterGetter) {
		super();
	}

	/**
	 * Formats the given FunctionDeclaration|FunctionExpression|ArrowFunction into a FormattedFunction
	 * @param {FunctionDeclaration|FunctionExpression|ArrowFunction} expression
	 * @returns {FormattedFunction}
	 */
	public format (expression: FunctionDeclaration|FunctionExpression|ArrowFunction): FormattedFunction {
		const base = {
			...super.format(expression),
			...this.functionLikeFormatter().format(expression),
			parameters: expression.parameters.map(parameter => this.parameterFormatter().format(parameter)),
			decorators: expression.decorators == null ? [] : expression.decorators.map(decorator => this.decoratorFormatter().format(decorator)),
			async: expression.modifiers == null ? false : expression.modifiers.find(modifier => modifier.kind === SyntaxKind.AsyncKeyword) != null
		};
		let result: FormattedFunction;

		if (isArrowFunction(expression)) {
			result = {
				...base,
				kind: FormattedFunctionKind.ARROW,
				expressionKind: FormattedExpressionKind.FUNCTION,
				implicitReturns: !isBlock(expression.body)
			};
		}

		else {
			result = {
				...base,
				kind: FormattedFunctionKind.FUNCTION,
				expressionKind: FormattedExpressionKind.FUNCTION,
				name: expression.name == null ? null : this.propertyNameFormatter().format(expression.name),
				typeParameters: expression.typeParameters == null ? [] : this.typeParameterFormatter().format(expression.typeParameters)
			};
		}

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the FormattedFunction
	 * @param {FormattedFunction} formatted
	 * @returns {string}
	 */
	protected stringify (formatted: FormattedFunction): string {
		let str = "";
		// Add decorators in top
		str += `${formatted.decorators.map(decorator => decorator.toString()).join("\\n")}\n`;
		if (formatted.async) str += "async ";

		if (formatted.kind === FormattedFunctionKind.ARROW) {
			// Add the '(<<args>>)' part
			str += `(${formatted.parameters.map(parameter => parameter.toString()).join(", ")})`;
			// Add the type (if given)
			if (formatted.type != null) {
				str += `: ${formatted.type.toString()} => `;
			}
			if (!formatted.implicitReturns) str += "{";
			if (formatted.body != null) {
				str += `\n${formatted.body.toString()}\n`;
			}
			if (!formatted.implicitReturns) str += "}";
		}
		else {
			str += `function `;
			if (formatted.name != null) str += `${formatted.name.toString()} `;
			if (formatted.typeParameters.length > 0) {
				str += `<${formatted.typeParameters.map(parameter => parameter.toString()).join(", ")}>`;
			}
			str += `(${formatted.parameters.map(parameter => parameter.toString()).join(", ")})`;

			// Add the type (if given)
			if (formatted.type != null) {
				str += `: ${formatted.type.toString()} `;
			}

			// If it has no body, simply set a semi-colon to end the expression.
			if (formatted.body == null) str += ";";
			else {
				str += `{\n${formatted.body.toString()}\n}`;
			}
		}
		return str;
	}
}