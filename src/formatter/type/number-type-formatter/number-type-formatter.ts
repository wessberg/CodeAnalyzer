import {IFormattedNumberType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {INumberTypeFormatter} from "./i-number-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedNumberTypes
 */
export class NumberTypeFormatter extends FormattedExpressionFormatter implements INumberTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedNumberType
	 * @returns {IFormattedNumberType}
	 */
	public format (expression: Token<SyntaxKind.NumberKeyword>): IFormattedNumberType {

		const numberType: IFormattedNumberType = {
			...super.format(expression),
			kind: FormattedTypeKind.NUMBER,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(numberType, expression);

		// Override the 'toString()' method
		numberType.toString = () => this.stringify();
		return numberType;
	}

	/**
	 * Generates a string representation of the IFormattedNumberType
	 * @returns {string}
	 */
	private stringify (): string {
		return `number`;
	}

}