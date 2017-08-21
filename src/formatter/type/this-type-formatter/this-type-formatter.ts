import {IThisType, TypeKind} from "@wessberg/type";
import {IThisTypeFormatter} from "./i-this-type-formatter";

/**
 * A class for generating IThisTypes
 */
export class ThisTypeFormatter implements IThisTypeFormatter {

	/**
	 * Formats the provided Expression into an IThisType
	 * @returns {IThisType}
	 */
	public format (): IThisType {

		const thisType: IThisType = {
			kind: TypeKind.THIS
		};

		// Override the 'toString()' method
		thisType.toString = () => this.stringify();
		return thisType;
	}

	/**
	 * Generates a string representation of the IThisType
	 * @returns {string}
	 */
	private stringify (): string {
		return `this`;
	}

}