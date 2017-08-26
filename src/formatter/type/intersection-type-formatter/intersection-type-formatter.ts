import {IIntersectionType, TypeKind} from "@wessberg/type";
import {IIntersectionTypeFormatter} from "./i-intersection-type-formatter";
import {IIntersectionTypeFormatterFormatOptions} from "./i-intersection-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IIntersectionTypes
 */
export class IntersectionTypeFormatter implements IIntersectionTypeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter) {}

	/**
	 * Formats the provided Expression into an IIntersectionType
	 * @param {IntersectionTypeNode} node
	 * @returns {IIntersectionType}
	 */
	public format ({node}: IIntersectionTypeFormatterFormatOptions): IIntersectionType {

		const intersectionType: IIntersectionType = {
			kind: TypeKind.INTERSECTION,
			types: node.types.map(type => this.typeFormatter().format(type))
		};

		// Override the 'toString()' method
		intersectionType.toString = () => this.stringify(intersectionType);
		return intersectionType;
	}

	/**
	 * Generates a string representation of the IIntersectionType
	 * @param {IIntersectionType} intersectionType
	 * @returns {string}
	 */
	private stringify (intersectionType: IIntersectionType): string {
		return `${intersectionType.types.map(type => type.toString()).join(" & ")}`;
	}

}