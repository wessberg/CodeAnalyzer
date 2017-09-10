import {ExportSpecifier, Identifier, ImportSpecifier, NamespaceExportDeclaration, NamespaceImport} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {FormattedModuleBinding} from "@wessberg/type";

export interface IModuleBindingFormatter extends IFormattedExpressionFormatter {
	format (expression: NamespaceImport|NamespaceExportDeclaration|ImportSpecifier|ExportSpecifier|Identifier): FormattedModuleBinding;
}