import {IIndexedAccessType, TypeKind} from "@wessberg/type";
import {IIndexedAccessTypeFormatter} from "./i-indexed-access-type-formatter";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";
import {IIndexedAccessTypeFormatterOptions} from "./i-indexed-access-type-formatter-options";

/**
 * A class for generating IIndexedAccessTypes
 */
export class IndexedAccessTypeFormatter implements IIndexedAccessTypeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter) {
	}

	/**
	 * Formats the provided Expression into an IIndexedAccessType
	 * @param {node} IndexedAccessTypeNode
	 * @returns {IIndexedAccessType}
	 */
	public format ({node}: IIndexedAccessTypeFormatterOptions): IIndexedAccessType {

		const result: IIndexedAccessType = {
			kind: TypeKind.INDEXED_ACCESS,
			base: this.typeFormatter().format(node.objectType),
			indexedAccessType: this.typeFormatter().format(node.indexType)
		};

		// Override the 'toString()' method
		result.toString = () => this.stringify(result);
		return result;
	}

	/**
	 * Generates a string representation of the IIndexedAccessType
	 * @param {IIndexedAccessType} formatted
	 * @returns {string}
	 */
	private stringify (formatted: IIndexedAccessType): string {
		return `${formatted.base.toString()}[${formatted.indexedAccessType.toString()}]`;
	}

}