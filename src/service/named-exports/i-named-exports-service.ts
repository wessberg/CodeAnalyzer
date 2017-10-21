import {ExportSpecifier, NamedExports} from "typescript";
import {INamedImportExportCtor} from "../../light-ast/ctor/named-import-export/i-named-import-export-ctor";

export interface INamedExportsService {
	hasExportWithName (name: string|INamedImportExportCtor|ExportSpecifier, namedExports: NamedExports): boolean;
	addNamedExportToNamedExports (name: string|INamedImportExportCtor, namedExports: NamedExports): NamedExports;
}