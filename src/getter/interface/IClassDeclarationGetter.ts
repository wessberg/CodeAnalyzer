import {ClassDeclaration, Expression, Node, Statement} from "typescript";
import {IClassDeclaration, IClassIndexer} from "../../identifier/interface/IIdentifier";

export interface IClassDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): IClassIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IClassIndexer;
	get (statement: ClassDeclaration): IClassDeclaration;
}