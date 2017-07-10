import {Expression, Node, Statement} from "typescript";
import {IResolvedSerializedIIdentifierValueMap} from "../../identifier/interface/IIdentifier";

export interface IResolvedSerializedIdentifierValueGetter {
	getForFile (fileName: string, deep?: boolean): IResolvedSerializedIIdentifierValueMap;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IResolvedSerializedIIdentifierValueMap;
	get (statement: Statement|Expression|Node): IResolvedSerializedIIdentifierValueMap;
}