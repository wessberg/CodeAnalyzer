import {IBindingIdentifier} from "./interface/IBindingIdentifier";
import {Statement, Expression, Node} from "typescript";

const locations: Map<BindingIdentifier, Statement|Expression|Node> = new Map();

/**
 * A simple class that represents identifiers.
 * @author Frederik Wessberg
 */
export class BindingIdentifier implements IBindingIdentifier {

	constructor (public name: string, location: Statement|Expression|Node) {
		locations.set(this, location);
	}

	public get location (): Statement|Expression|Node {
		return <Statement|Expression|Node>locations.get(this);
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