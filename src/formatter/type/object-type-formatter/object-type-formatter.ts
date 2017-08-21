import {IObjectType, TypeKind} from "@wessberg/type";
import {IObjectTypeFormatter} from "./i-object-type-formatter";

/**
 * A class for generating IObjectTypes
 */
export class ObjectTypeFormatter implements IObjectTypeFormatter {

	/**
	 * Formats the provided Expression into an IObjectType
	 * @returns {IObjectType}
	 */
	public format (): IObjectType {

		const objectType: IObjectType = {
			kind: TypeKind.OBJECT
		};

		// Override the 'toString()' method
		objectType.toString = () => this.stringify();
		return objectType;
	}

	/**
	 * Generates a string representation of the IObjectType
	 * @returns {string}
	 */
	private stringify (): string {
		return `object`;
	}

}