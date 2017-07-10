import {Expression, Node, Statement, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {IVariableIndexer} from "../../identifier/interface/IIdentifier";

export interface IVariableDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): IVariableIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IVariableIndexer;
	get (statement: VariableDeclaration|VariableDeclarationList|VariableStatement): IVariableIndexer;
}