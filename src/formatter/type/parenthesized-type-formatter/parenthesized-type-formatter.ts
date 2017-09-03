import {IFormattedParenthesizedType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IParenthesizedTypeFormatter} from "./i-parenthesized-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {ParenthesizedTypeNode} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedParenthesizedTypes
 */
export class ParenthesizedTypeFormatter extends FormattedExpressionFormatter implements IParenthesizedTypeFormatter {
	constructor (private astMapper: AstMapperGetter,
							 private typeFormatter: TypeFormatterGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IParenthesizedType
	 * @param {ParenthesizedTypeNode} expression
	 * @returns {IFormattedParenthesizedType}
	 */
	public format (expression: ParenthesizedTypeNode): IFormattedParenthesizedType {

		const parenthesizedType: IFormattedParenthesizedType = {
			...super.format(expression),
			kind: FormattedTypeKind.PARENTHESIZED,
			type: this.typeFormatter().format(expression.type),
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(parenthesizedType, expression);

		// Override the 'toString()' method
		parenthesizedType.toString = () => this.stringify(parenthesizedType);
		return parenthesizedType;
	}

	/**
	 * Generates a string representation of the IFormattedParenthesizedType
	 * @param {IFormattedParenthesizedType} parenthesizedType
	 * @returns {string}
	 */
	private stringify (parenthesizedType: IFormattedParenthesizedType): string {
		return `(${parenthesizedType.type.toString()})`;
	}

}