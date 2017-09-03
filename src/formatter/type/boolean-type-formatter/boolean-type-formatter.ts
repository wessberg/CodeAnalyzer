import {IFormattedBooleanType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IBooleanTypeFormatter} from "./i-boolean-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IBooleanTypes
 */
export class BooleanTypeFormatter extends FormattedExpressionFormatter implements IBooleanTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedBooleanType
	 * @returns {IFormattedBooleanType}
	 */
	public format (expression: Token<SyntaxKind.BooleanKeyword>): IFormattedBooleanType {

		const booleanType: IFormattedBooleanType = {
			...super.format(expression),
			kind: FormattedTypeKind.BOOLEAN,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(booleanType, expression);

		// Override the 'toString()' method
		booleanType.toString = () => this.stringify();
		return booleanType;
	}

	/**
	 * Generates a string representation of the IBooleanType
	 * @returns {string}
	 */
	private stringify (): string {
		return `boolean`;
	}

}