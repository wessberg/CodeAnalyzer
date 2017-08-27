import {ITypeofType, TypeKind} from "@wessberg/type";
import {ITypeofTypeFormatter} from "./i-typeof-type-formatter";
import {ITypeofTypeFormatterFormatOptions} from "./i-typeof-type-formatter-format-options";
import {ReferenceTypeFormatterGetter} from "../reference-type-formatter/reference-type-formatter-getter";

/**
 * A class for generating ITypeofTypes
 */
export class TypeofTypeFormatter implements ITypeofTypeFormatter {
	constructor (private referenceTypeFormatter: ReferenceTypeFormatterGetter) {
	}

	/**
	 * Formats the provided Expression into an ITypeofType
	 * @param {TypeNode} node
	 * @returns {ITypeofType}
	 */
	public format ({node}: ITypeofTypeFormatterFormatOptions): ITypeofType {

		const typeofType: ITypeofType = {
			kind: TypeKind.TYPEOF,
			of: this.referenceTypeFormatter().format({node: node.exprName})
		};

		// Override the 'toString()' method
		typeofType.toString = () => this.stringify(typeofType);
		return typeofType;
	}

	/**
	 * Generates a string representation of the ITypeofType
	 * @param {ITypeofType} typeofType
	 * @returns {string}
	 */
	private stringify (typeofType: ITypeofType): string {
		return `typeof ${typeofType.of.toString()}`;
	}

}