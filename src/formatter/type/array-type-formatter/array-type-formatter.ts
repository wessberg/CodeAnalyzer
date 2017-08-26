import {IArrayType, TypeKind} from "@wessberg/type";
import {IArrayTypeFormatter} from "./i-array-type-formatter";
import {IArrayTypeFormatterFormatOptions} from "./i-array-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IArrayTypes
 */
export class ArrayTypeFormatter implements IArrayTypeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter) {}

	/**
	 * Formats the provided Expression into an ITupleType
	 * @param {ArrayTypeNode} node
	 * @returns {IArrayType}
	 */
	public format ({node}: IArrayTypeFormatterFormatOptions): IArrayType {

		const arrayType: IArrayType = {
			kind: TypeKind.ARRAY,
			type: this.typeFormatter().format(node.elementType)
		};

		// Override the 'toString()' method
		arrayType.toString = () => this.stringify(arrayType);
		return arrayType;
	}

	/**
	 * Generates a string representation of the IArrayType
	 * @param {IArrayType} arrayType
	 * @returns {string}
	 */
	private stringify (arrayType: IArrayType): string {
		return `${arrayType.type.toString()}[]`;
	}

}