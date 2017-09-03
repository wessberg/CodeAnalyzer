import {IFormattedSymbolType, FormattedTypeKind, FormattedExpressionKind} from "@wessberg/type";
import {ISymbolTypeFormatter} from "./i-symbol-type-formatter";
import {SyntaxKind, Token} from "typescript";
import {FormattedExpressionFormatter} from "../../expression/formatted-expression/formatted-expression-formatter";
import {AstMapperGetter} from "../../../mapper/ast-mapper/ast-mapper-getter";

/**
 * A class for generating IFormattedSymbolTypes
 */
export class SymbolTypeFormatter extends FormattedExpressionFormatter implements ISymbolTypeFormatter {
	constructor (private astMapper: AstMapperGetter) {
		super();
	}

	/**
	 * Formats the provided Expression into an IFormattedSymbolType
	 * @returns {IFormattedSymbolType}
	 */
	public format (expression: Token<SyntaxKind.SymbolKeyword>): IFormattedSymbolType {

		const symbolType: IFormattedSymbolType = {
			...super.format(expression),
			kind: FormattedTypeKind.SYMBOL,
			expressionKind: FormattedExpressionKind.TYPE
		};

		// Map the formatted expression to the relevant statement
		this.astMapper().mapFormattedExpressionToStatement(symbolType, expression);

		// Override the 'toString()' method
		symbolType.toString = () => this.stringify();
		return symbolType;
	}

	/**
	 * Generates a string representation of the IFormattedSymbolType
	 * @returns {string}
	 */
	private stringify (): string {
		return `symbol`;
	}

}