import {IKeyofType, TypeKind} from "@wessberg/type";
import {IKeyofTypeFormatter} from "./i-keyof-type-formatter";
import {IKeyofTypeFormatterFormatOptions} from "./i-keyof-type-formatter-format-options";
import {TypeFormatterGetter} from "../type-formatter/type-formatter-getter";

/**
 * A class for generating IKeyofTypes
 */
export class KeyofTypeFormatter implements IKeyofTypeFormatter {
	constructor (private typeFormatter: TypeFormatterGetter) {}

	/**
	 * Formats the provided Expression into an IKeyofType
	 * @param {TypeNode} node
	 * @returns {IKeyofType}
	 */
	public format ({node}: IKeyofTypeFormatterFormatOptions): IKeyofType {

		const keyofType: IKeyofType = {
			kind: TypeKind.KEYOF,
			type: this.typeFormatter().format(node)
		};

		// Override the 'toString()' method
		keyofType.toString = () => this.stringify(keyofType);
		return keyofType;
	}

	/**
	 * Generates a string representation of the IKeyofType
	 * @param {IKeyofType} keyofType
	 * @returns {string}
	 */
	private stringify (keyofType: IKeyofType): string {
		return `keyof ${keyofType.type.toString()}`;
	}

}