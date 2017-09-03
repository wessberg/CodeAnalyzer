import {ConstructorDeclaration} from "typescript";
import {IClassConstructorFormatter} from "./i-class-constructor-formatter";
import {FormattedExpressionFormatter} from "../formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionKind, IFormattedClassConstructor} from "@wessberg/type";
import {BlockFormatterGetter} from "../block/block-formatter-getter";
import {ParameterFormatterGetter} from "../parameter/parameter-formatter-getter";

/**
 * A class that can format class constructors
 */
export class ClassConstructorFormatter extends FormattedExpressionFormatter implements IClassConstructorFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private blockFormatter: BlockFormatterGetter,
							 private parameterFormatter: ParameterFormatterGetter) {
		super();
	}

	/**
	 * Formats the given Decorator into an IFormattedClassConstructor
	 * @param {ConstructorDeclaration} expression
	 * @returns {IFormattedClassConstructor}
	 */
	public format (expression: ConstructorDeclaration): IFormattedClassConstructor {

		const result: IFormattedClassConstructor = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.CLASS_CONSTRUCTOR,
			body: expression.body == null ? null : this.blockFormatter().format(expression.body),
			parameters: expression.parameters.map(parameter => this.parameterFormatter().format(parameter))
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedClassConstructor
	 * @param {IFormattedClassConstructor} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IFormattedClassConstructor): string {
		let str = "constructor ";
		str += `(${formatted.parameters.map(parameter => parameter.toString()).join(", ")})`;
		if (formatted.body == null) str += ";";
		else {
			str += ` {\n${formatted.body.toString()}\n}`;
		}
		return str;
	}

}