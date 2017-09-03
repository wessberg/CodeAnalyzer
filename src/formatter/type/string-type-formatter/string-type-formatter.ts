import {IFormattedStringType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IStringTypeFormatter} from "./i-string-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedStringType
 */
export class StringTypeFormatter extends FormattedExpressionFormatter implements IStringTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedStringType
	 * @returns {IFormattedStringType}
	 */
	public format (expression: Token<SyntaxKind.StringKeyword>): IFormattedStringType {

		const stringType: IFormattedStringType = {
			...super.format(expression),
			kind: FormattedTypeKind.STRING,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(stringType, expression);

		// Override the 'toString()' method
		stringType.toString = () => this.stringify();
		return stringType;
	}

	/**
	 * Generates a string representation of the IFormattedStringType
	 * @returns {string}
	 */
	private stringify (): string {
		return `string`;
	}

}