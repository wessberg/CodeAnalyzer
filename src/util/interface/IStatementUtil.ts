import {Declaration, Expression, Node, Statement} from "typescript";

export interface IStatementUtil {
	shouldSkip (statement: Statement|Expression|Declaration|Node): boolean;
	isResolvingStatement (statement: Statement|Expression|Node): boolean;
	setResolvingStatement (statement: Statement|Expression|Node): void;
	removeResolvingStatement (statement: Statement|Expression|Node): void;
}