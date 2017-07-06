import {CallExpression, Expression, ImportDeclaration, ImportEqualsDeclaration, Node, Statement, VariableStatement} from "typescript";
import {IImportDeclaration} from "../../identifier/interface/IIdentifier";

export interface IImportDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): IImportDeclaration[];
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IImportDeclaration[];
	get (statement: ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression): IImportDeclaration|null;
}