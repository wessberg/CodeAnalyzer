import {Declaration, Expression, Node, Statement, SyntaxKind} from "typescript";
import {IStatementUtil} from "./interface/IStatementUtil";

/**
 * A class that keeps track of which statements are currently being parsed and resolved.
 */
export class StatementUtil implements IStatementUtil {
	/**
	 * A Set of statements that are currently being resolved and parsed.
	 * @type {Set<Statement|Expression|Node>}
	 */
	private static readonly RESOLVING_STATEMENTS: Set<Statement|Expression|Node> = new Set();
	/**
	 * A Set of SyntaxKinds to skip when parsing statements.
	 * @type {Set<SyntaxKind>}
	 */
	private static readonly SKIP_KINDS: Set<SyntaxKind> = new Set([
		SyntaxKind.InterfaceDeclaration,
		SyntaxKind.InterfaceKeyword,
		SyntaxKind.NamespaceKeyword,
		SyntaxKind.DeclareKeyword
	]);

	/**
	 * Returns true if the provided Statement is currently being resolved.
	 * @param {Statement | Expression | Node} statement
	 * @returns {boolean}
	 */
	public isResolvingStatement (statement: Statement|Expression|Node): boolean {
		return StatementUtil.RESOLVING_STATEMENTS.has(statement);
	}

	/**
	 * Adds the given statement to the Set of statements currently being resolved.
	 * @param {Statement | Expression | Node} statement
	 */
	public setResolvingStatement (statement: Statement|Expression|Node): void {
		StatementUtil.RESOLVING_STATEMENTS.add(statement);
	}

	/**
	 * Removes the given statement from the Set of statements that are currently being resolved.
	 * @param {Statement | Expression | Node} statement
	 */
	public removeResolvingStatement (statement: Statement|Expression|Node): void {
		StatementUtil.RESOLVING_STATEMENTS.delete(statement);
	}

	/**
	 * Returns true if the given Statement should be skipped.
	 * @param {Statement | Expression | Declaration | Node} statement
	 * @returns {boolean}
	 */
	public shouldSkip (statement: Statement|Expression|Declaration|Node): boolean {
		return StatementUtil.SKIP_KINDS.has(statement.kind);
	}

}