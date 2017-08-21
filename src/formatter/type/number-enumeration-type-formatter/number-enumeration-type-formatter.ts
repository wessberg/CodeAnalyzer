import {INumberEnumerationType, TypeKind} from "@wessberg/type";
import {INumberEnumerationTypeFormatter} from "./i-number-enumeration-type-formatter";
import {INumberEnumerationTypeFormatterFormatOptions} from "./i-number-enumeration-type-formatter-format-options";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for generating INumberEnumerationTypes
 */
export class NumberEnumerationTypeFormatter implements INumberEnumerationTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {
	}

	/**
	 * Formats the provided Expression into an INumberEnumerationType
	 * @param {NumericLiteral} node
	 * @returns {INumberEnumerationType}
	 */
	public format ({node}: INumberEnumerationTypeFormatterFormatOptions): INumberEnumerationType {

		const numberEnumerationType: INumberEnumerationType = {
			kind: TypeKind.NUMBER_ENUMERATION,
			value: parseInt(this.astUtil.takeName(node))
		};

		// Override the 'toString()' method
		numberEnumerationType.toString = () => this.stringify(numberEnumerationType);
		return numberEnumerationType;
	}

	/**
	 * Generates a string representation of the INumberEnumerationType
	 * @param {number} value
	 * @returns {string}
	 */
	private stringify ({value}: INumberEnumerationType): string {
		return `${value}`;
	}

}