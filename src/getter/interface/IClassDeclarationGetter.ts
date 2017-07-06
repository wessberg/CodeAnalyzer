import {ClassDeclaration, Expression, Node, Statement} from "typescript";
import {ClassIndexer, IClassDeclaration} from "../../identifier/interface/IIdentifier";

export interface IClassDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): ClassIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): ClassIndexer;
	get (statement: ClassDeclaration): IClassDeclaration;
}