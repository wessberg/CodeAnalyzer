import {IBindingIdentifier} from "./interface/IBindingIdentifier";
import { ArbitraryValue } from "src/interface/ISimpleLanguageService";

/**
 * A simple class that represents identifiers.
 * @author Frederik Wessberg
 */
export class BindingIdentifier implements IBindingIdentifier {

	constructor(public name: string, public path: ArbitraryValue[]|null) { }

	/**
	 * The string representation of an identifier
	 * @override
	 * @returns {string}
	 */
	public toString(): string {
		const name = this.name == null ? "" : this.name;
		return `${name}${this.flattenPath()}`;
	}

	/**
	 * Flattens the path down to a string.
	 * @returns {string}
	 */
	public flattenPath(): string {
		if (this.path == null) return "";

		return this.path.map(part => {
			if (typeof part === "string") {
				if (part.startsWith("[") && part.endsWith("]")) return part;
				return `["${part}"]`;
			}
			
			return `[${part}]`;
		}).join("");
	}
}