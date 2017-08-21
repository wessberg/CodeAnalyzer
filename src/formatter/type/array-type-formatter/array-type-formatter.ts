import {IArrayType, TypeKind} from "@wessberg/type";
import {IArrayTypeFormatter} from "./i-array-type-formatter";
import {IArrayTypeFormatterFormatOptions} from "./i-array-type-formatter-format-options";

/**
 * A class for generating IArrayTypes
 */
export class ArrayTypeFormatter implements IArrayTypeFormatter {

	/**
	 * Formats the provided Expression into an ITupleType
	 * @param {ArrayTypeNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IArrayType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IArrayTypeFormatterFormatOptions): IArrayType {

		const arrayType: IArrayType = {
			kind: TypeKind.ARRAY,
			type: typeFormatter.format(node.elementType, interfaceTypeMemberFormatter, parameterTypeFormatter)
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