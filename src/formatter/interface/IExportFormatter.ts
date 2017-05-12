import {ClassDeclaration, ExportAssignment, ExportDeclaration, FunctionDeclaration, VariableStatement} from "typescript";
import {IExportDeclaration} from "../../service/interface/ISimpleLanguageService";
import {IModuleFormatter} from "./IModuleFormatter";

export interface IExportFormatter extends IModuleFormatter {
	format (statement: ExportDeclaration | VariableStatement | ExportAssignment | FunctionDeclaration | ClassDeclaration): IExportDeclaration | null;
}