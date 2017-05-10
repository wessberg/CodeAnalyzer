import {ImportDeclaration, ImportEqualsDeclaration, VariableStatement, CallExpression} from "typescript";
import {IImportDeclaration} from "../../interface/ISimpleLanguageService";
import {IModuleFormatter} from "./IModuleFormatter";

export interface IImportFormatter extends IModuleFormatter {
	format (statement: ImportDeclaration | ImportEqualsDeclaration | VariableStatement | CallExpression): IImportDeclaration | null;
}