import {IModuleFormatter} from "./IModuleFormatter";
import {IExportDeclaration} from "../../service/interface/ISimpleLanguageService";
import {ExportDeclaration, VariableStatement, ExportAssignment, FunctionDeclaration, ClassDeclaration} from "typescript";

export interface IExportFormatter extends IModuleFormatter {
	format (statement: ExportDeclaration | VariableStatement | ExportAssignment | FunctionDeclaration | ClassDeclaration): IExportDeclaration | null;
}