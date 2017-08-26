import {ITupleType, TypeKind} from "@wessberg/type";
import {ITupleTypeFormatter} from "./i-tuple-type-formatter";
import {ITupleTypeFormatterFormatOptions} from "./i-tuple-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating ITupleTypes
 */
export class TupleTypeFormatter implements ITupleTypeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter) {}

	/**
	 * Formats the provided Expression into an ITupleType
	 * @param {TupleTypeNode} node
	 * @returns {ITupleType}
	 */
	public format ({node}: ITupleTypeFormatterFormatOptions): ITupleType {

		const tupleType: ITupleType = {
			kind: TypeKind.TUPLE,
			members: node.elementTypes.map(elementType => this.typeFormatter().format(elementType))
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