import {IFormattedNeverType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {INeverTypeFormatter} from "./i-never-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedNeverType
 */
export class NeverTypeFormatter extends FormattedExpressionFormatter implements INeverTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedNeverType
	 * @returns {IFormattedNeverType}
	 */
	public format (expression: Token<SyntaxKind.NeverKeyword>): IFormattedNeverType {

		const neverType: IFormattedNeverType = {
			...super.format(expression),
			kind: FormattedTypeKind.NEVER,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(neverType, expression);

		// Override the 'toString()' method
		neverType.toString = () => this.stringify();
		return neverType;
	}

	/**
	 * Generates a string representation of the INeverType
	 * @returns {string}
	 */
	private stringify (): string {
		return `never`;
	}

}