import {IAnyType, TypeKind} from "@wessberg/type";
import {IAnyTypeFormatter} from "./i-any-type-formatter";

/**
 * A class for generating IAnyTypes
 */
export class AnyTypeFormatter implements IAnyTypeFormatter {

	/**
	 * Formats the provided Expression into an IAnyType
	 * @returns {IAnyType}
	 */
	public format (): IAnyType {

		const anyType: IAnyType = {
			kind: TypeKind.ANY
		};

		// Override the 'toString()' method
		anyType.toString = () => this.stringify();
		return anyType;
	}

	/**
	 * Generates a string representation of the IAnyType
	 * @returns {string}
	 */
	private stringify (): string {
		return `any`;
	}

}