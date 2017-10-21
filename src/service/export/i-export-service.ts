import {INodeService} from "../node/i-node-service";
import {ExportDeclaration, NamedExports, SourceFile} from "typescript";
import {INamedImportExportCtor} from "../../light-ast/ctor/named-import-export/i-named-import-export-ctor";

export interface IExportService extends INodeService<ExportDeclaration> {
	getExportWithNamedExport (namedExport: INamedImportExportCtor|string, sourceFile: SourceFile, path?: string): ExportDeclaration|undefined;
	getExportsForPath (path: string, sourceFile: SourceFile): (ExportDeclaration)[];
	getNamespaceExports (sourceFile: SourceFile, deep?: boolean): ExportDeclaration[];
	getNamedExportsForExportDeclaration (exportDeclaration: ExportDeclaration): NamedExports|undefined;
	getPathForExportDeclaration (exportDeclaration: ExportDeclaration): string;

	isNamespaceExport (exportDeclaration: ExportDeclaration): boolean;
	hasNamedExport (namedExport: INamedImportExportCtor|string, exportDeclaration: ExportDeclaration): boolean;

	changePathOfExportDeclaration (path: string, exportDeclaration: ExportDeclaration): ExportDeclaration;
	addNamedExportToExportDeclaration (namedExport: INamedImportExportCtor, exportDeclaration: ExportDeclaration): ExportDeclaration;
}