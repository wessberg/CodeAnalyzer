import {Expression, Node, Statement} from "typescript";
import {IIdentifierMap} from "../../identifier/interface/IIdentifier";

export interface IAllIdentifiersGetter {
	getForFile (fileName: string, deep?: boolean): IIdentifierMap;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IIdentifierMap;
	get (statement: Statement|Expression|Node): IIdentifierMap;
}