import {Expression, FunctionDeclaration, Node, Statement} from "typescript";
import {IFunctionDeclaration, IFunctionIndexer} from "../../identifier/interface/IIdentifier";

export interface IFunctionDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): IFunctionIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IFunctionIndexer;
	get (statement: FunctionDeclaration): IFunctionDeclaration;
}