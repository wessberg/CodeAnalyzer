import {INodeService} from "../node/i-node-service";
import {ExportDeclaration, NamedExports, SourceFile} from "typescript";
import {INamedImportExportDict} from "../../dict/named-import-export/i-named-import-export-dict";

export interface IExportService extends INodeService<ExportDeclaration> {
	getExportWithNamedExport (namedExport: INamedImportExportDict|string, sourceFile: SourceFile, path?: string): ExportDeclaration|undefined;
	getExportsForPath (path: string, sourceFile: SourceFile): (ExportDeclaration)[];
	getNamespaceExports (sourceFile: SourceFile, deep?: boolean): ExportDeclaration[];
	getNamedExportsForExportDeclaration (exportDeclaration: ExportDeclaration): NamedExports|undefined;
	getPathForExportDeclaration (exportDeclaration: ExportDeclaration): string;

	isNamespaceExport (exportDeclaration: ExportDeclaration): boolean;
	hasNamedExport (namedExport: INamedImportExportDict|string, exportDeclaration: ExportDeclaration): boolean;

	changePathOfExportDeclaration (path: string, exportDeclaration: ExportDeclaration): ExportDeclaration;
	addNamedExportToExportDeclaration (namedExport: INamedImportExportDict, exportDeclaration: ExportDeclaration): ExportDeclaration;
}