import {AstNode} from "../../type/ast-node/ast-node";

export interface IImportServiceBase {
	getImportedFilesForFile (file: string): string[];
	getImportedFilesForStatementFile (statement: AstNode): string[];
}