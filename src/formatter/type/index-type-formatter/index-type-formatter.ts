import {IIndexTypeFormatter} from "./i-index-type-formatter";
import {IIndexType, TypeKind} from "@wessberg/type";
import {IIndexTypeFormatterFormatOptions} from "./i-index-type-formatter-format-options";
import {InterfaceTypeMemberFormatterGetter} from "../interface-type-member-formatter/interface-type-member-formatter-getter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IIndexTypes
 */
export class IndexTypeFormatter implements IIndexTypeFormatter {
	constructor (private interfaceTypeMemberFormatter: InterfaceTypeMemberFormatterGetter,
							 private typeFormatter: TypeFormatterGetter) {}

	/**
	 * Formats the provided Expression into an IIndexType
	 * @param {IndexSignatureDeclaration} node
	 * @returns {IIndexType}
	 */
	public format ({node}: IIndexTypeFormatterFormatOptions): IIndexType {
		const indexType: IIndexType = {
			kind: TypeKind.INDEX,
			key: this.interfaceTypeMemberFormatter().format(node.parameters[0]),
			value: this.typeFormatter().format(node.type)
		};

		// Override the 'toString()' method
		indexType.toString = () => this.stringify(indexType);
		return indexType;
	}

	/**
	 * Generates a string representation of the IIndexType
	 * @param {IIndexType} indexType
	 * @returns {string}
	 */
	private stringify (indexType: IIndexType): string {
		return `[${indexType.key.toString()}]: ${indexType.value.toString()}`;
	}

}