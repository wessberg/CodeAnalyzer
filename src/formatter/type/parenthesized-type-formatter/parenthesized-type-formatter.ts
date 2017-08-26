import {IParenthesizedType, TypeKind} from "@wessberg/type";
import {IParenthesizedTypeFormatter} from "./i-parenthesized-type-formatter";
import {IParenthesizedTypeFormatterFormatOptions} from "./i-parenthesized-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IParenthesizedTypes
 */
export class ParenthesizedTypeFormatter implements IParenthesizedTypeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter) {}

	/**
	 * Formats the provided Expression into an IParenthesizedType
	 * @param {TypeNode} node
	 * @returns {IParenthesizedType}
	 */
	public format ({node}: IParenthesizedTypeFormatterFormatOptions): IParenthesizedType {

		const parenthesizedType: IParenthesizedType = {
			kind: TypeKind.PARENTHESIZED,
			type: this.typeFormatter().format(node)
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