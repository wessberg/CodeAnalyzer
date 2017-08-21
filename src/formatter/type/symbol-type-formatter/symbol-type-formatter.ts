import {ISymbolType, TypeKind} from "@wessberg/type";
import {ISymbolTypeFormatter} from "./i-symbol-type-formatter";

/**
 * A class for generating ISymbolTypes
 */
export class SymbolTypeFormatter implements ISymbolTypeFormatter {

	/**
	 * Formats the provided Expression into an ISymbolType
	 * @returns {ISymbolType}
	 */
	public format (): ISymbolType {

		const symbolType: ISymbolType = {
			kind: TypeKind.SYMBOL
		};

		// Override the 'toString()' method
		symbolType.toString = () => this.stringify();
		return symbolType;
	}

	/**
	 * Generates a string representation of the ISymbolType
	 * @returns {string}
	 */
	private stringify (): string {
		return `symbol`;
	}

}