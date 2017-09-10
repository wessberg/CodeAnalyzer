import {IFormattedExport} from "@wessberg/type";
import {ExportDeclaration, NodeArray} from "typescript";
import {AstNode} from "../../type/ast-node/ast-node";

export interface IExportServiceBase {
	getExportsForFile (file: string, content?: string): IFormattedExport[];
	getExportsForStatement (statement: ExportDeclaration): IFormattedExport[];
	getExportsForStatements (statements: NodeArray<AstNode>): IFormattedExport[];
}