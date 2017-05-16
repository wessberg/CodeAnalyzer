import {ClassDeclaration, ExportAssignment, ExportDeclaration, FunctionDeclaration, VariableStatement, ExpressionStatement, BinaryExpression, CallExpression} from "typescript";
import {IExportDeclaration} from "../../service/interface/ICodeAnalyzer";
import {IModuleFormatter} from "./IModuleFormatter";

export interface IExportFormatter extends IModuleFormatter {
	format (statement: ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|ExpressionStatement|BinaryExpression|CallExpression): IExportDeclaration|null;
}