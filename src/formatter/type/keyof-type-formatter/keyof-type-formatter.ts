import {IKeyofType, TypeKind} from "@wessberg/type";
import {IKeyofTypeFormatter} from "./i-keyof-type-formatter";
import {IKeyofTypeFormatterFormatOptions} from "./i-keyof-type-formatter-format-options";

/**
 * A class for generating IKeyofTypes
 */
export class KeyofTypeFormatter implements IKeyofTypeFormatter {

	/**
	 * Formats the provided Expression into an IKeyofType
	 * @param {TypeNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IKeyofType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IKeyofTypeFormatterFormatOptions): IKeyofType {

		const keyofType: IKeyofType = {
			kind: TypeKind.KEYOF,
			type: typeFormatter.format(node, interfaceTypeMemberFormatter, parameterTypeFormatter)
		};

		// Override the 'toString()' method
		keyofType.toString = () => this.stringify(keyofType);
		return keyofType;
	}

	/**
	 * Generates a string representation of the IKeyofType
	 * @param {IKeyofType} keyofType
	 * @returns {string}
	 */
	private stringify (keyofType: IKeyofType): string {
		return `keyof ${keyofType.type.toString()}`;
	}

}