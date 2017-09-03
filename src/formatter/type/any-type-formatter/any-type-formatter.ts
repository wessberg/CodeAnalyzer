import {IFormattedAnyType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IAnyTypeFormatter} from "./i-any-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IAnyTypes
 */
export class AnyTypeFormatter extends FormattedExpressionFormatter implements IAnyTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IAnyType
	 * @returns {IFormattedAnyType}
	 */
	public format (expression: Token<SyntaxKind.AnyKeyword>): IFormattedAnyType {

		const anyType: IFormattedAnyType = {
			...super.format(expression),
			kind: FormattedTypeKind.ANY,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(anyType, expression);

		// Override the 'toString()' method
		anyType.toString = () => this.stringify();
		return anyType;
	}

	/**
	 * Generates a string representation of the IAnyType
	 * @returns {string}
	 */
	private stringify (): string {
		return `any`;
	}

}