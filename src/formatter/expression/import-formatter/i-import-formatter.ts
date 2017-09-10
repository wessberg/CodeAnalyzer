import {ImportDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedImport} from "@wessberg/type";

export interface IImportFormatter extends IFormattedExpressionFormatter {
	format (expression: ImportDeclaration): IFormattedImport;
}