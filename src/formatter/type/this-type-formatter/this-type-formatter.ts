import {IFormattedThisType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IThisTypeFormatter} from "./i-this-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedThisTypes
 */
export class ThisTypeFormatter extends FormattedExpressionFormatter implements IThisTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedThisType
	 * @returns {IFormattedThisType}
	 */
	public format (expression: Token<SyntaxKind.ThisKeyword>): IFormattedThisType {

		const thisType: IFormattedThisType = {
			...super.format(expression),
			kind: FormattedTypeKind.THIS,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(thisType, expression);

		// Override the 'toString()' method
		thisType.toString = () => this.stringify();
		return thisType;
	}

	/**
	 * Generates a string representation of the IFormattedThisType
	 * @returns {string}
	 */
	private stringify (): string {
		return `this`;
	}

}