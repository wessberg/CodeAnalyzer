import {IUnionType, TypeKind} from "@wessberg/type";
import {IUnionTypeFormatter} from "./i-union-type-formatter";
import {IUnionTypeFormatterFormatOptions} from "./i-union-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IUnionTypes
 */
export class UnionTypeFormatter implements IUnionTypeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter) {}

	/**
	 * Formats the provided Expression into an IUnionType
	 * @param {UnionTypeNode} node
	 * @returns {IUnionType}
	 */
	public format ({node}: IUnionTypeFormatterFormatOptions): IUnionType {

		const unionType: IUnionType = {
			kind: TypeKind.UNION,
			types: node.types.map(type => this.typeFormatter().format(type))
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