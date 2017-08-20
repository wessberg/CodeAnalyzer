import {IPojoType, TypeKind} from "@wessberg/type";
import {PropertySignature} from "typescript";
import {IPojoTypeFormatter} from "./i-pojo-type-formatter";
import {IPojoTypeFormatterFormatOptions} from "./i-pojo-type-formatter-format-options";

/**
 * A class for generating IPojoTypes
 */
export class PojoTypeFormatter implements IPojoTypeFormatter {

	/**
	 * Formats the provided Expression into an IPojoType
	 * @param {TypeLiteralNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @returns {IPojoType}
	 */
	public format ({node, interfaceTypeMemberFormatter}: IPojoTypeFormatterFormatOptions): IPojoType {

		const pojoType: IPojoType = {
			kind: TypeKind.POJO,
			properties: node.members.map(member => interfaceTypeMemberFormatter.format(<PropertySignature>member))
		};

		// Override the 'toString()' method
		pojoType.toString = () => this.stringify(pojoType);
		return pojoType;
	}

	/**
	 * Generates a string representation of the IPojoType
	 * @param {IPojoType} pojoType
	 * @returns {string}
	 */
	private stringify (pojoType: IPojoType): string {
		return `{${pojoType.properties.map(property => property.toString()).join(", ")}}`;
	}

}