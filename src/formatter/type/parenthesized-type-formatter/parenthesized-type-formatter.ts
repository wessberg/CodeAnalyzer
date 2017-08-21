import {IParenthesizedType, TypeKind} from "@wessberg/type";
import {IParenthesizedTypeFormatter} from "./i-parenthesized-type-formatter";
import {IParenthesizedTypeFormatterFormatOptions} from "./i-parenthesized-type-formatter-format-options";

/**
 * A class for generating IParenthesizedTypes
 */
export class ParenthesizedTypeFormatter implements IParenthesizedTypeFormatter {

	/**
	 * Formats the provided Expression into an IParenthesizedType
	 * @param {TypeNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IParenthesizedType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IParenthesizedTypeFormatterFormatOptions): IParenthesizedType {

		const parenthesizedType: IParenthesizedType = {
			kind: TypeKind.PARENTHESIZED,
			type: typeFormatter.format(node, interfaceTypeMemberFormatter, parameterTypeFormatter)
		};

		// Override the 'toString()' method
		parenthesizedType.toString = () => this.stringify(parenthesizedType);
		return parenthesizedType;
	}

	/**
	 * Generates a string representation of the IParenthesizedType
	 * @param {IParenthesizedType} parenthesizedType
	 * @returns {string}
	 */
	private stringify (parenthesizedType: IParenthesizedType): string {
		return `(${parenthesizedType.type.toString()})`;
	}

}