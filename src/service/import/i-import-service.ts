import {Identifier, ImportDeclaration, NamedImportBindings, NamedImports, NamespaceImport, SourceFile} from "typescript";
import {IImportDict} from "../../dict/import/i-import-dict";
import {INamedImportExportDict} from "../../dict/named-import-export/i-named-import-export-dict";
import {INodeService} from "../node/i-node-service";

export interface IImportService extends INodeService<ImportDeclaration> {
	getImportWithNamedImport (namedImport: INamedImportExportDict, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined;
	getImportWithNamespace (namespace: string, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined;
	getImportWithName (name: string, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined;
	getImportWithBinding (binding: string, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined;
	getImportsForPath (path: string, sourceFile: SourceFile): ImportDeclaration[];
	getNameForImportDeclaration (importDeclaration: ImportDeclaration): Identifier|undefined;
	getNamedImportBindingsForImportDeclaration (importDeclaration: ImportDeclaration): NamedImportBindings|undefined;
	getNamedImportsForImportDeclaration (importDeclaration: ImportDeclaration): NamedImports|undefined;
	getNamespaceImportForImportDeclaration (importDeclaration: ImportDeclaration): NamespaceImport|undefined;
	getPathForImportDeclaration (importDeclaration: ImportDeclaration): string;

	hasNamedImports (importDeclaration: ImportDeclaration): boolean;
	hasNamedImport (namedImport: INamedImportExportDict|string, importDeclaration: ImportDeclaration): boolean;
	hasName (importDeclaration: ImportDeclaration): boolean;
	hasSpecificName (name: string, importDeclaration: ImportDeclaration): boolean;
	hasNamespaceImport (importDeclaration: ImportDeclaration): boolean;
	hasNamespaceImportWithName (namespaceName: string, importDeclaration: ImportDeclaration): boolean;

	createImportDeclaration (options: IImportDict): ImportDeclaration;
	createAndAddImportDeclarationToSourceFile (options: IImportDict, sourceFile: SourceFile): ImportDeclaration;

	changePathOfImportDeclaration (path: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNameToImportDeclaration (name: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamedImportToImportDeclaration (namedImport: INamedImportExportDict, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamespaceImportToImportDeclaration (namedImport: string, importDeclaration: ImportDeclaration): ImportDeclaration;
}