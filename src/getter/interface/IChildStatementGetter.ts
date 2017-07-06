import {Declaration, Expression, Node, Statement} from "typescript";

export interface IChildStatementGetter {
	get (statement: Statement|Expression|Declaration|Node): (Statement|Declaration|Expression|Node)[];
}