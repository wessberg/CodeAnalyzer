import {INumberType, TypeKind} from "@wessberg/type";
import {INumberTypeFormatter} from "./i-number-type-formatter";

/**
 * A class for generating INumberTypes
 */
export class NumberTypeFormatter implements INumberTypeFormatter {

	/**
	 * Formats the provided Expression into an INumberType
	 * @returns {INumberType}
	 */
	public format (): INumberType {

		const numberType: INumberType = {
			kind: TypeKind.NUMBER
		};

		// Override the 'toString()' method
		numberType.toString = () => this.stringify();
		return numberType;
	}

	/**
	 * Generates a string representation of the INumberType
	 * @returns {string}
	 */
	private stringify (): string {
		return `number`;
	}

}