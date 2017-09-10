import {IFormattedImport} from "@wessberg/type";
import {ImportDeclaration, NodeArray} from "typescript";
import {AstNode} from "../../type/ast-node/ast-node";

export interface IImportServiceBase {
	getImportsForFile (file: string): IFormattedImport[];
	getImportsForStatement (statement: ImportDeclaration): IFormattedImport[];
	getImportsForStatements (statements: NodeArray<AstNode>): IFormattedImport[];
}