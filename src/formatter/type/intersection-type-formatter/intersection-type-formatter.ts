import {IIntersectionType, TypeKind} from "@wessberg/type";
import {IIntersectionTypeFormatter} from "./i-intersection-type-formatter";
import {IIntersectionTypeFormatterFormatOptions} from "./i-intersection-type-formatter-format-options";

/**
 * A class for generating IIntersectionTypes
 */
export class IntersectionTypeFormatter implements IIntersectionTypeFormatter {

	/**
	 * Formats the provided Expression into an IIntersectionType
	 * @param {IntersectionTypeNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {IIntersectionType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: IIntersectionTypeFormatterFormatOptions): IIntersectionType {

		const intersectionType: IIntersectionType = {
			kind: TypeKind.INTERSECTION,
			types: node.types.map(type => typeFormatter.format(type, interfaceTypeMemberFormatter, parameterTypeFormatter))
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