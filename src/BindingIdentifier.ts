import {IBindingIdentifier} from "./interface/IBindingIdentifier";

/**
 * A simple class that represents identifiers.
 * @author Frederik Wessberg
 */
export class BindingIdentifier implements IBindingIdentifier {

	constructor(public name: string, public path: string|null) { }
	


	/**
	 * The string representation of an identifier
	 * @override
	 * @returns {string}
	 */
	public toString(): string {
		const name = this.name == null ? "" : this.name;
		const path = this.path == null ? "" : this.path;
		return `${name}${path}`;
	}
}