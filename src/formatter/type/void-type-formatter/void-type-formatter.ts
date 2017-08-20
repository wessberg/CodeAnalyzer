import {IVoidType, TypeKind} from "@wessberg/type";
import {IVoidTypeFormatter} from "./i-void-type-formatter";

/**
 * A class for generating IVoidTypes
 */
export class VoidTypeFormatter implements IVoidTypeFormatter {

	/**
	 * Formats the provided Expression into an IVoidType
	 * @returns {IVoidType}
	 */
	public format (): IVoidType {
		let voidType: IVoidType;

		voidType = {
			kind: TypeKind.VOID
		};

		// Override the 'toString()' method
		voidType.toString = () => this.stringify();
		return voidType;
	}

	/**
	 * Generates a string representation of the IVoidType
	 * @returns {string}
	 */
	private stringify (): string {
		return `void`;
	}

}