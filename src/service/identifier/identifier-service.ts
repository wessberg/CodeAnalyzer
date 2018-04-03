import {IIdentifierService} from "./i-identifier-service";
import {Identifier, SyntaxKind} from "typescript";
import {NodeService} from "../node/node-service";

/**
 * A service for working with Identifiers
 */
export class IdentifierService extends NodeService<Identifier> implements IIdentifierService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {Iterable<SyntaxKind>}
	 */
	protected readonly ALLOWED_KINDS: Iterable<SyntaxKind> = [SyntaxKind.Identifier];

	/**
	 * Gets the text of an Identifier
	 * @param {Identifier} identifier
	 * @returns {string}
	 */
	public getText (identifier: Identifier): string {
		return identifier.text;
	}
}