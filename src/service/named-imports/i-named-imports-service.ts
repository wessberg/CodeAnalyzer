import {ImportSpecifier, NamedImports} from "typescript";
import {INamedImportDict} from "../../dict/import/i-named-import-dict";

export interface INamedImportsService {
	hasImportWithName (name: string|INamedImportDict|ImportSpecifier, namedImports: NamedImports): boolean;
	addImportToNamedImports (name: string|INamedImportDict, namedImports: NamedImports): NamedImports;
}