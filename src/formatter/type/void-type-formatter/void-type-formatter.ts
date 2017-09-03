import {IFormattedVoidType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {IVoidTypeFormatter} from "./i-void-type-formatter";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {SyntaxKind, Token} from "typescript";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedVoidTypes
 */
export class VoidTypeFormatter extends FormattedExpressionFormatter implements IVoidTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedVoidType
	 * @returns {IFormattedVoidType}
	 */
	public format (expression: Token<SyntaxKind.VoidKeyword>): IFormattedVoidType {

		const voidType: IFormattedVoidType = {
			...super.format(expression),
			kind: FormattedTypeKind.VOID,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(voidType, expression);

		// Override the 'toString()' method
		voidType.toString = () => this.stringify();
		return voidType;
	}

	/**
	 * Generates a string representation of the IFormattedVoidType
	 * @returns {string}
	 */
	private stringify (): string {
		return `void`;
	}

}