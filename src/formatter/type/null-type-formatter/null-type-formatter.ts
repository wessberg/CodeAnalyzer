import {INullType, TypeKind} from "@wessberg/type";
import {INullTypeFormatter} from "./i-null-type-formatter";

/**
 * A class for generating INullTypes
 */
export class NullTypeFormatter implements INullTypeFormatter {

	/**
	 * Formats the provided Expression into an INullType
	 * @returns {INullType}
	 */
	public format (): INullType {

		const nullType: INullType = {
			kind: TypeKind.NULL
		};

		// Override the 'toString()' method
		nullType.toString = () => this.stringify();
		return nullType;
	}

	/**
	 * Generates a string representation of the INullType
	 * @returns {string}
	 */
	private stringify (): string {
		return `null`;
	}

}