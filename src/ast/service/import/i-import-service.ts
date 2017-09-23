import {Identifier, ImportDeclaration, NamedImportBindings, NamedImports, NamespaceImport, NodeArray, SourceFile} from "typescript";
import {IImportDict} from "../../dict/import/i-import-dict";

export interface IImportService {
	createImportDeclaration (options: IImportDict): ImportDeclaration;

	getImportsWithNamedImport (namedImport: string, path: string, sourceFile: SourceFile): NodeArray<ImportDeclaration>;
	getImports (sourceFile: SourceFile): NodeArray<ImportDeclaration>;
	getImportsForPath (path: string, sourceFile: SourceFile): NodeArray<ImportDeclaration>;
	getNameForImportDeclaration (importDeclaration: ImportDeclaration): Identifier|undefined;
	getNamedImportBindingsForImportDeclaration (importDeclaration: ImportDeclaration): NamedImportBindings|undefined;
	getNamedImportsForImportDeclaration (importDeclaration: ImportDeclaration): NamedImports|undefined;
	getNamespaceImportForImportDeclaration (importDeclaration: ImportDeclaration): NamespaceImport|undefined;

	hasNamedImports (importDeclaration: ImportDeclaration): boolean;
	hasNamedImport (namedImport: string, importDeclaration: ImportDeclaration): boolean;
	hasName (importDeclaration: ImportDeclaration): boolean;
	hasSpecificName (name: string, importDeclaration: ImportDeclaration): boolean;
	hasNamespaceImport (importDeclaration: ImportDeclaration): boolean;
	hasNamespaceImportWithName (namespaceName: string, importDeclaration: ImportDeclaration): boolean;

	changePathOfImportDeclaration (path: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNameToImportDeclaration (name: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamedImportToImportDeclaration (namedImport: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamespaceImportToImportDeclaration (namedImport: string, importDeclaration: ImportDeclaration): ImportDeclaration;
}