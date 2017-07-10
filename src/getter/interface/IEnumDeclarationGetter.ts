import {EnumDeclaration, Expression, Node, Statement} from "typescript";
import {IEnumDeclaration, IEnumIndexer} from "../../identifier/interface/IIdentifier";

export interface IEnumDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): IEnumIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IEnumIndexer;
	get (statement: EnumDeclaration): IEnumDeclaration;
}