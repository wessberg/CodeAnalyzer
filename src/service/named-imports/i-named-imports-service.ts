import {ImportSpecifier, NamedImports} from "typescript";
import {INamedImportExportCtor} from "../../light-ast/ctor/named-import-export/i-named-import-export-ctor";

export interface INamedImportsService {
	hasImportWithName (name: string|INamedImportExportCtor|ImportSpecifier, namedImports: NamedImports): boolean;
	addImportToNamedImports (name: string|INamedImportExportCtor, namedImports: NamedImports): NamedImports;
}