import {Expression, Node, Statement} from "typescript";
import {ResolvedSerializedIIdentifierValueMap} from "../../identifier/interface/IIdentifier";

export interface IResolvedSerializedIdentifierValueGetter {
	getForFile (fileName: string, deep?: boolean): ResolvedSerializedIIdentifierValueMap;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): ResolvedSerializedIIdentifierValueMap;
	get (statement: Statement|Expression|Node): ResolvedSerializedIIdentifierValueMap;
}