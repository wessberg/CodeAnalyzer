import {Identifier, ImportDeclaration, NamedImportBindings, NamedImports, NamespaceImport, SourceFile} from "typescript";
import {INodeService} from "../node/i-node-service";
import {INamedImportExportCtor} from "../../light-ast/ctor/named-import-export/i-named-import-export-ctor";
import {IImportCtor} from "../../light-ast/ctor/import/i-import-ctor";
import {IPlacement} from "../../placement/i-placement";

export interface IImportService extends INodeService<ImportDeclaration> {
	getImportWithNamedImport (namedImport: INamedImportExportCtor, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined;
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
	hasNamedImport (namedImport: INamedImportExportCtor|string, importDeclaration: ImportDeclaration): boolean;
	hasName (importDeclaration: ImportDeclaration): boolean;
	hasSpecificName (name: string, importDeclaration: ImportDeclaration): boolean;
	hasNamespaceImport (importDeclaration: ImportDeclaration): boolean;
	hasNamespaceImportWithName (namespaceName: string, importDeclaration: ImportDeclaration): boolean;

	createImportDeclaration (options: IImportCtor): ImportDeclaration;
	createAndAddImportDeclarationToSourceFile (options: IImportCtor, sourceFile: SourceFile, placement?: IPlacement): ImportDeclaration;
	removeImportDeclaration (importDeclaration: ImportDeclaration): boolean;
	removeImportDeclarationsWithPath (path: string, sourceFile: SourceFile): boolean;

	changePathOfImportDeclaration (path: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNameToImportDeclaration (name: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamedImportToImportDeclaration (namedImport: INamedImportExportCtor, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamespaceImportToImportDeclaration (namedImport: string, importDeclaration: ImportDeclaration): ImportDeclaration;
}