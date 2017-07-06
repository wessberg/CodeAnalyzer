import {BinaryExpression, CallExpression, ClassDeclaration, ExportAssignment, ExportDeclaration, Expression, ExpressionStatement, FunctionDeclaration, Node, Statement, VariableStatement} from "typescript";
import {IExportDeclaration} from "../../identifier/interface/IIdentifier";

export interface IExportDeclarationGetter {
	getForFile (fileName: string, deep?: boolean): IExportDeclaration[];
	getForStatements (statements: (Statement|Expression|Node)[], deep?: boolean): IExportDeclaration[];
	get (statement: ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|ExpressionStatement|BinaryExpression|CallExpression): IExportDeclaration|null;
}