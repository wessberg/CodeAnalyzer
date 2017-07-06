import {EnumDeclaration, Expression, Node, Statement} from "typescript";
import {EnumIndexer, IEnumDeclaration} from "../../identifier/interface/IIdentifier";

export interface IEnumDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): EnumIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): EnumIndexer;
	get (statement: EnumDeclaration): IEnumDeclaration;
}