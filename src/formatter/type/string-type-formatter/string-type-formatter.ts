import {IStringType, TypeKind} from "@wessberg/type";
import {IStringTypeFormatter} from "./i-string-type-formatter";

/**
 * A class for generating IStringTypes
 */
export class StringTypeFormatter implements IStringTypeFormatter {

	/**
	 * Formats the provided Expression into an IStringType
	 * @returns {IStringType}
	 */
	public format (): IStringType {

		const stringType: IStringType = {
			kind: TypeKind.STRING
		};

		// Override the 'toString()' method
		stringType.toString = () => this.stringify();
		return stringType;
	}

	/**
	 * Generates a string representation of the IStringType
	 * @returns {string}
	 */
	private stringify (): string {
		return `string`;
	}

}