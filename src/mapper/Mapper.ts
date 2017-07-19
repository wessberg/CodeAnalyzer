import {Expression, Node, Statement} from "typescript";
import {IMapper} from "./interface/IMapper";
import {IIdentifier} from "../identifier/interface/IIdentifier";

/**
 * A class that maps IIdentifiers to their Typescript AST counterpart.
 */
export class Mapper implements IMapper {
	/**
	 * A Map between IIdentifiers and Statements.
	 * @type {Map<IIdentifier, Node>}
	 */
	private static readonly map: Map<IIdentifier, Statement|Expression|Node> = new Map();

	/**
	 * Maps the given IIdentifier to the given Statement.
	 * @param {IIdentifier} identifier
	 * @param {Statement | Expression | Node} statement
	 */
	public set (identifier: IIdentifier, statement: Statement|Expression|Node): void {
		Mapper.map.set(identifier, statement);
	}

	/**
	 * Gets a Statement for the given IIdentifier.
	 * @param {IIdentifier} identifier
	 * @returns {Statement | Expression | Node}
	 */
	public get (identifier: IIdentifier): Statement|Expression|Node|undefined {
		return Mapper.map.get(identifier);
	}
}