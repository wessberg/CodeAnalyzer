import {IIdentifierUtil} from "./interface/IIdentifierUtil";
import {IdentifierMapKind} from "../identifier/interface/IIdentifier";

/**
 * A class for working with IIdentifiers.
 */
export class IdentifierUtil implements IIdentifierUtil {

	/**
	 * Sets the IIdentifierKind on an object as a non-enumerable member.
	 * @param {T} on
	 * @param {IdentifierMapKind} kind
	 * @returns {T}
	 */
	public setKind<T> (on: T, kind: IdentifierMapKind): T {
		Object.defineProperty(on, "___kind", {
			value: kind,
			enumerable: false
		});
		return on;
	}

}