import {IIndexTypeFormatter} from "./i-index-type-formatter";
import {IIndexType, TypeKind} from "@wessberg/type";
import {IIndexTypeFormatterFormatOptions} from "./i-index-type-formatter-format-options";

/**
 * A class for generating IIndexTypes
 */
export class IndexTypeFormatter implements IIndexTypeFormatter {

	/**
	 * Formats the provided Expression into an IIndexType
	 * @param {IndexSignatureDeclaration} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IIndexType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IIndexTypeFormatterFormatOptions): IIndexType {
		const indexType: IIndexType = {
			kind: TypeKind.INDEX,
			key: interfaceTypeMemberFormatter.format(node.parameters[0]),
			value: typeFormatter.format(node.type, interfaceTypeMemberFormatter, parameterTypeFormatter)
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