import {INeverType, TypeKind} from "@wessberg/type";
import {INeverTypeFormatter} from "./i-never-type-formatter";

/**
 * A class for generating INeverTypes
 */
export class NeverTypeFormatter implements INeverTypeFormatter {

	/**
	 * Formats the provided Expression into an INeverType
	 * @returns {INeverType}
	 */
	public format (): INeverType {

		const neverType: INeverType = {
			kind: TypeKind.NEVER
		};

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