import {IIdentifierService} from "./i-identifier-service";
import {Identifier} from "typescript";

/**
 * A service for working with Identifiers
 */
export class IdentifierService implements IIdentifierService {

	/**
	 * Gets the text of an Identifier
	 * @param {Identifier} identifier
	 * @returns {string}
	 */
	public getText (identifier: Identifier): string {
		return identifier.text;
	}
}