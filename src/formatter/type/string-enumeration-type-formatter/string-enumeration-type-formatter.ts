import {IStringEnumerationType, TypeKind} from "@wessberg/type";
import {IStringEnumerationTypeFormatter} from "./i-string-enumeration-type-formatter";
import {IStringEnumerationTypeFormatterFormatOptions} from "./i-string-enumeration-type-formatter-format-options";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for generating IStringEnumerationTypes
 */
export class StringEnumerationTypeFormatter implements IStringEnumerationTypeFormatter {
	constructor (private astUtil: ITypescriptASTUtil) {
	}

	/**
	 * Formats the provided Expression into an IStringEnumerationType
	 * @param {StringLiteral} node
	 * @returns {IStringEnumerationType}
	 */
	public format ({node}: IStringEnumerationTypeFormatterFormatOptions): IStringEnumerationType {

		const stringEnumerationType: IStringEnumerationType = {
			kind: TypeKind.STRING_ENUMERATION,
			value: this.astUtil.takeName(node)
		};

		// Override the 'toString()' method
		stringEnumerationType.toString = () => this.stringify(stringEnumerationType);
		return stringEnumerationType;
	}

	/**
	 * Generates a string representation of the IStringEnumerationType
	 * @param {string} value
	 * @returns {string}
	 */
	private stringify ({value}: IStringEnumerationType): string {
		return value;
	}

}