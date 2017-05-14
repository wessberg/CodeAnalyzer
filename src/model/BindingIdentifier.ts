import {IBindingIdentifier} from "./interface/IBindingIdentifier";

/**
 * A simple class that represents identifiers.
 * @author Frederik Wessberg
 */
export class BindingIdentifier implements IBindingIdentifier {

	constructor (public name: string) {
	}

	/**
	 * The string representation of an identifier
	 * @override
	 * @returns {string}
	 */
	public toString (): string {
		return this.name == null ? "" : this.name;
	}
}