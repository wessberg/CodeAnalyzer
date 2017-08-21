import {ITupleType, TypeKind} from "@wessberg/type";
import {ITupleTypeFormatter} from "./i-tuple-type-formatter";
import {ITupleTypeFormatterFormatOptions} from "./i-tuple-type-formatter-format-options";

/**
 * A class for generating ITupleTypes
 */
export class TupleTypeFormatter implements ITupleTypeFormatter {

	/**
	 * Formats the provided Expression into an ITupleType
	 * @param {TupleTypeNode} node
	 * @param {IInterfaceTypeMemberFormatter} interfaceTypeMemberFormatter
	 * @param {IParameterTypeFormatter} parameterTypeFormatter
	 * @param {ITypeFormatter} typeFormatter
	 * @returns {ITupleType}
	 */
	public format ({node, interfaceTypeMemberFormatter, parameterTypeFormatter, typeFormatter}: ITupleTypeFormatterFormatOptions): ITupleType {

		const tupleType: ITupleType = {
			kind: TypeKind.TUPLE,
			members: node.elementTypes.map(elementType => typeFormatter.format(elementType, interfaceTypeMemberFormatter, parameterTypeFormatter))
		};

		// Override the 'toString()' method
		tupleType.toString = () => this.stringify(tupleType);
		return tupleType;
	}

	/**
	 * Generates a string representation of the ITupleType
	 * @param {ITupleType} tupleType
	 * @returns {string}
	 */
	private stringify (tupleType: ITupleType): string {
		return `[${tupleType.members.map(member => member.toString()).join(", ")}]`;
	}

}