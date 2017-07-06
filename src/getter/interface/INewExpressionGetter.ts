import {Expression, Node, Statement} from "typescript";
import {INewExpression} from "../../identifier/interface/IIdentifier";

export interface INewExpressionGetter {
	getForFile (fileName: string, deep?: boolean): INewExpression[];
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): INewExpression[];
	get (statement: Statement|Expression): INewExpression;
}