import {CallExpression, ImportDeclaration, ImportEqualsDeclaration, VariableStatement} from "typescript";
import {IImportDeclaration} from "../../service/interface/ISimpleLanguageService";
import {IModuleFormatter} from "./IModuleFormatter";

export interface IImportFormatter extends IModuleFormatter {
	format (statement: ImportDeclaration | ImportEqualsDeclaration | VariableStatement | CallExpression): IImportDeclaration | null;
}