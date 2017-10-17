import {ExportSpecifier, ImportClause, ImportSpecifier} from "typescript";
import {IImportClauseDict} from "../dict/import-clause/i-import-clause-dict";
import {INamedImportExportDict} from "../dict/named-import-export/i-named-import-export-dict";

export interface INodeToDictMapper {
	toImportClauseDict (node: ImportClause|undefined): IImportClauseDict|undefined;
	toNamedImportExportDict (node: ImportSpecifier|ExportSpecifier|undefined): INamedImportExportDict|undefined;
}