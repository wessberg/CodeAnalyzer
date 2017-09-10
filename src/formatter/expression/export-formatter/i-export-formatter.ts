import {ExportDeclaration} from "typescript";
import {IFormattedExpressionFormatter} from "../formatted-expression/i-formatted-expression-formatter";
import {IFormattedExport} from "@wessberg/type";

export interface IExportFormatter extends IFormattedExpressionFormatter {
	format (expression: ExportDeclaration): IFormattedExport;
}