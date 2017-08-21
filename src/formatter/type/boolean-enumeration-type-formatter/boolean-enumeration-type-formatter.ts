import {IBooleanEnumerationType, TypeKind} from "@wessberg/type";
import {IBooleanEnumerationTypeFormatter} from "./i-boolean-enumeration-type-formatter";
import {IBooleanEnumerationTypeFormatterFormatOptions} from "./i-boolean-enumeration-type-formatter-format-options";
import {SyntaxKind} from "typescript";

/**
 * A class for generating IBooleanEnumerationTypes
 */
export class BooleanEnumerationTypeFormatter implements IBooleanEnumerationTypeFormatter {

	/**
	 * Formats the provided Expression into an IBooleanEnumerationType
	 * @param {BooleanLiteral} node
	 * @returns {IBooleanEnumerationType}
	 */
	public format ({node}: IBooleanEnumerationTypeFormatterFormatOptions): IBooleanEnumerationType {

		const booleanEnumerationType: IBooleanEnumerationType = {
			kind: TypeKind.BOOLEAN_ENUMERATION,
			value: node.kind === SyntaxKind.TrueKeyword
		};

		// Override the 'toString()' method
		booleanEnumerationType.toString = () => this.stringify(booleanEnumerationType);
		return booleanEnumerationType;
	}

	/**
	 * Generates a string representation of the IBooleanEnumerationType
	 * @param {boolean} value
	 * @returns {string}
	 */
	private stringify ({value}: IBooleanEnumerationType): string {
		return `${value}`;
	}

}