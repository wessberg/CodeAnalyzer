import {ExportDeclaration, ImportDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedModule} from "@wessberg/type";

export interface IModuleFormatter extends IFormattedExpressionFormatter {
	format (expression: ImportDeclaration|ExportDeclaration): IFormattedModule;
}