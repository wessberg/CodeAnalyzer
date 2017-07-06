import {CallExpression, ImportDeclaration, ImportEqualsDeclaration, VariableStatement} from "typescript";
import {IModuleFormatter} from "./IModuleFormatter";
import {IImportDeclaration} from "../../identifier/interface/IIdentifier";

export interface IImportFormatter extends IModuleFormatter {
	format (statement: ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression): IImportDeclaration|null;
}