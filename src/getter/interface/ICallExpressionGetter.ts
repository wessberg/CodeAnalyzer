import {Expression, Node, Statement} from "typescript";
import {ICallExpression} from "../../identifier/interface/IIdentifier";

export interface ICallExpressionGetter {
	getForFile (fileName: string, deep?: boolean): ICallExpression[];
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): ICallExpression[];
	get (statement: Statement|Expression): ICallExpression;
}