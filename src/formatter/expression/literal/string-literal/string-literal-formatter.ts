import {LiteralExpression, NoSubstitutionTemplateLiteral, StringLiteral} from "typescript";
import {IStringLiteralFormatter} from "./i-string-literal-formatter";
import {AstMapperGetter} from "../../../../mapper/ast-mapper/ast-mapper-getter";
import {FormattedExpressionFormatter} from "../../formatted-expression/formatted-expression-formatter";
import {FormattedExpressionKind, IFormattedStringLiteral} from "@wessberg/type";

/**
 * A class that can format String literals
 */
export class StringLiteralFormatter extends FormattedExpressionFormatter implements IStringLiteralFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the given StringLiteral into an IFormattedStringLiteral
	 * @param {StringLiteral} expression
	 * @returns {IFormattedStringLiteral}
	 */
	public format (expression: StringLiteral|NoSubstitutionTemplateLiteral|LiteralExpression): IFormattedStringLiteral {

		const result: IFormattedStringLiteral = {
			...super.format(expression),
			expressionKind: FormattedExpressionKind.STRING_LITERAL,
			value: expression.text
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(result, expression);

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IFormattedStringLiteral
	 * @param {IFormattedStringLiteral} formattedStringLiteral
	 * @returns {string}
	 */
	private stringify (formattedStringLiteral: IFormattedStringLiteral): string {
		return `\`${formattedStringLiteral.value}\``;
	}

}