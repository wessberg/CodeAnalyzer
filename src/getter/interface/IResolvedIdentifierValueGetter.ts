import {Expression, Node, Statement} from "typescript";
import {IResolvedIIdentifierValueMap} from "../../identifier/interface/IIdentifier";

export interface IResolvedIdentifierValueGetter {
	getForFile (fileName: string, deep?: boolean): IResolvedIIdentifierValueMap;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IResolvedIIdentifierValueMap;
	get (statement: Statement|Expression|Node): IResolvedIIdentifierValueMap;
}