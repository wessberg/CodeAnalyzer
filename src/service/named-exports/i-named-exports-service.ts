import {INamedImportExportDict} from "../../dict/named-import-export/i-named-import-export-dict";
import {ExportSpecifier, NamedExports} from "typescript";

export interface INamedExportsService {
	hasExportWithName (name: string|INamedImportExportDict|ExportSpecifier, namedExports: NamedExports): boolean;
	addNamedExportToNamedExports (name: string|INamedImportExportDict, namedExports: NamedExports): NamedExports;
}