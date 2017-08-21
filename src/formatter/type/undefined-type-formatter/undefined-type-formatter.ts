import {IUndefinedType, TypeKind} from "@wessberg/type";
import {IUndefinedTypeFormatter} from "./i-undefined-type-formatter";

/**
 * A class for generating IUndefinedTypes
 */
export class UndefinedTypeFormatter implements IUndefinedTypeFormatter {

	/**
	 * Formats the provided Expression into an IUndefinedType
	 * @returns {IUndefinedType}
	 */
	public format (): IUndefinedType {

		const undefinedType: IUndefinedType = {
			kind: TypeKind.UNDEFINED
		};

		// Override the 'toString()' method
		undefinedType.toString = () => this.stringify();
		return undefinedType;
	}

	/**
	 * Generates a string representation of the IUndefinedType
	 * @returns {string}
	 */
	private stringify (): string {
		return `undefined`;
	}

}