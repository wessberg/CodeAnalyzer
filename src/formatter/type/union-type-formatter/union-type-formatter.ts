import {IUnionType, TypeKind} from "@wessberg/type";
import {IUnionTypeFormatter} from "./i-union-type-formatter";
import {IUnionTypeFormatterFormatOptions} from "./i-union-type-formatter-format-options";

/**
 * A class for generating IUnionTypes
 */
export class UnionTypeFormatter implements IUnionTypeFormatter {

	/**
	 * Formats the provided Expression into an IUnionType
	 * @param {UnionTypeNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IUnionType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IUnionTypeFormatterFormatOptions): IUnionType {

		const unionType: IUnionType = {
			kind: TypeKind.UNION,
			types: node.types.map(type => typeFormatter.format(type, interfaceTypeMemberFormatter, parameterTypeFormatter))
		};

		// Override the 'toString()' method
		unionType.toString = () => this.stringify(unionType);
		return unionType;
	}

	/**
	 * Generates a string representation of the IUnionType
	 * @param {IParenthesizedType} unionType
	 * @returns {string}
	 */
	private stringify (unionType: IUnionType): string {
		return `${unionType.types.map(type => type.toString()).join(" | ")}`;
	}

}