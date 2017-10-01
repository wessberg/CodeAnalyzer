import {ImportDeclaration, SourceFile} from "typescript";
import {IImportDict} from "../../dict/import/i-import-dict";
import {INamedImportDict} from "../../dict/import/i-named-import-dict";
import {IImportHelper} from "@wessberg/typescript-ast-util";

export interface IImportService extends IImportHelper {
	createImportDeclaration (options: IImportDict): ImportDeclaration;
	createAndAddImportDeclarationToSourceFile (options: IImportDict, sourceFile: SourceFile): ImportDeclaration;

	changePathOfImportDeclaration (path: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNameToImportDeclaration (name: string, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamedImportToImportDeclaration (namedImport: INamedImportDict, importDeclaration: ImportDeclaration): ImportDeclaration;
	addNamespaceImportToImportDeclaration (namedImport: string, importDeclaration: ImportDeclaration): ImportDeclaration;
}