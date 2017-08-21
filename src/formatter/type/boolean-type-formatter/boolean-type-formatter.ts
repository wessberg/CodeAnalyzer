import {IBooleanType, TypeKind} from "@wessberg/type";
import {IBooleanTypeFormatter} from "./i-boolean-type-formatter";

/**
 * A class for generating IBooleanTypes
 */
export class BooleanTypeFormatter implements IBooleanTypeFormatter {

	/**
	 * Formats the provided Expression into an IBooleanType
	 * @returns {IBooleanType}
	 */
	public format (): IBooleanType {

		const booleanType: IBooleanType = {
			kind: TypeKind.BOOLEAN
		};

		// Override the 'toString()' method
		booleanType.toString = () => this.stringify();
		return booleanType;
	}

	/**
	 * Generates a string representation of the IBooleanType
	 * @returns {string}
	 */
	private stringify (): string {
		return `boolean`;
	}

}