import {ImportSpecifier, NamedImports} from "typescript";
import {INamedImportExportDict} from "../../dict/named-import-export/i-named-import-export-dict";

export interface INamedImportsService {
	hasImportWithName (name: string|INamedImportExportDict|ImportSpecifier, namedImports: NamedImports): boolean;
	addImportToNamedImports (name: string|INamedImportExportDict, namedImports: NamedImports): NamedImports;
}