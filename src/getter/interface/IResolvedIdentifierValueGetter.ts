import {Expression, Node, Statement} from "typescript";
import {ResolvedIIdentifierValueMap} from "../../identifier/interface/IIdentifier";

export interface IResolvedIdentifierValueGetter {
	getForFile (fileName: string, deep?: boolean): ResolvedIIdentifierValueMap;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): ResolvedIIdentifierValueMap;
	get (statement: Statement|Expression|Node): ResolvedIIdentifierValueMap;
}