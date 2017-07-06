import {Expression, Node, Statement, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {VariableIndexer} from "../../identifier/interface/IIdentifier";

export interface IVariableDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): VariableIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): VariableIndexer;
	get (statement: VariableDeclaration|VariableDeclarationList|VariableStatement): VariableIndexer;
}