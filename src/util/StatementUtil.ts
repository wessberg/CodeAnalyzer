import {Declaration, Expression, Node, Statement, SyntaxKind} from "typescript";
import {IStatementUtil} from "./interface/IStatementUtil";

export class StatementUtil implements IStatementUtil {
	private static readonly RESOLVING_STATEMENTS: Set<Statement|Expression|Node> = new Set();
	private static readonly SKIP_KINDS: Set<SyntaxKind> = new Set([
		SyntaxKind.InterfaceDeclaration,
		SyntaxKind.InterfaceKeyword,
		SyntaxKind.NamespaceKeyword,
		SyntaxKind.DeclareKeyword
	]);

	public isResolvingStatement (statement: Statement|Expression|Node): boolean {
		return StatementUtil.RESOLVING_STATEMENTS.has(statement);
	}

	public setResolvingStatement (statement: Statement|Expression|Node): void {
		StatementUtil.RESOLVING_STATEMENTS.add(statement);
	}

	public removeResolvingStatement (statement: Statement|Expression|Node): void {
		StatementUtil.RESOLVING_STATEMENTS.delete(statement);
	}

	public shouldSkip (statement: Statement|Expression|Declaration|Node): boolean {
		return StatementUtil.SKIP_KINDS.has(statement.kind);
	}

}