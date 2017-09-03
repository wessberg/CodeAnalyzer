import {IFormattedUndefinedType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IUndefinedTypeFormatter} from "./i-undefined-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IUndefinedTypes
 */
export class UndefinedTypeFormatter extends FormattedExpressionFormatter implements IUndefinedTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedUndefinedType
	 * @returns {IFormattedUndefinedType}
	 */
	public format (expression: Token<SyntaxKind.UndefinedKeyword>): IFormattedUndefinedType {

		const undefinedType: IFormattedUndefinedType = {
			...super.format(expression),
			kind: FormattedTypeKind.UNDEFINED,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(undefinedType, expression);

		// Override the 'toString()' method
		undefinedType.toString = () => this.stringify();
		return undefinedType;
	}

	/**
	 * Generates a string representation of the IFormattedUndefinedType
	 * @returns {string}
	 */
	private stringify (): string {
		return `undefined`;
	}

}