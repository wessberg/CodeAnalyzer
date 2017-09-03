import {IFormattedNullType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {INullTypeFormatter} from "./i-null-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedNullTypes
 */
export class NullTypeFormatter extends FormattedExpressionFormatter implements INullTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedNullType
	 * @returns {IFormattedNullType}
	 */
	public format (expression: Token<SyntaxKind.NullKeyword>): IFormattedNullType {

		const nullType: IFormattedNullType = {
			...super.format(expression),
			kind: FormattedTypeKind.NULL,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(nullType, expression);

		// Override the 'toString()' method
		nullType.toString = () => this.stringify();
		return nullType;
	}

	/**
	 * Generates a string representation of the IFormattedNullType
	 * @returns {string}
	 */
	private stringify (): string {
		return `null`;
	}

}