import {BinaryExpression, CallExpression, ClassDeclaration, ExportAssignment, ExportDeclaration, ExpressionStatement, FunctionDeclaration, PropertyAccessExpression, VariableStatement} from "typescript";
import {IModuleFormatter} from "./IModuleFormatter";
import {IExportDeclaration} from "../../identifier/interface/IIdentifier";

export interface IExportFormatter extends IModuleFormatter {
	format (statement: ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|ExpressionStatement|BinaryExpression|CallExpression|PropertyAccessExpression): IExportDeclaration|null;
}