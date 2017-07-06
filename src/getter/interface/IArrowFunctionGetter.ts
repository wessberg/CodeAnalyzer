import {ArrowFunction, Expression, Node, Statement} from "typescript";
import {IArrowFunction} from "../../identifier/interface/IIdentifier";

export interface IArrowFunctionGetter {
	getForFile (fileName: string, deep?: boolean): IArrowFunction[];
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IArrowFunction[];
	get (statement: ArrowFunction): IArrowFunction;
}