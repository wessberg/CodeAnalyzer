import {Expression, FunctionDeclaration, Node, Statement} from "typescript";
import {FunctionIndexer, IFunctionDeclaration} from "../../identifier/interface/IIdentifier";

export interface IFunctionDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): FunctionIndexer;
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): FunctionIndexer;
	get (statement: FunctionDeclaration): IFunctionDeclaration;
}