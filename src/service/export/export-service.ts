import {NodeService} from "../node/node-service";
import {ExportDeclaration, isStringLiteral, NamedExports, SourceFile, SyntaxKind} from "typescript";
import {IExportService} from "./i-export-service";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IRemover} from "../../remover/i-remover-base";
import {IUpdater} from "../../updater/i-updater-getter";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {INamedExportsService} from "../named-exports/i-named-exports-service";
import {IStringUtil} from "@wessberg/stringutil";
import {INamedImportExportCtor} from "../../light-ast/ctor/named-import-export/i-named-import-export-ctor";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";

/**
 * A service for working with ExportDeclarations
 */
export class ExportService extends NodeService<ExportDeclaration> implements IExportService {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.ExportDeclaration];

	constructor (private namedExportsService: INamedExportsService,
							 private formatter: IFormatter,
							 private printer: IPrinter,
							 private stringUtil: IStringUtil,
							 updater: IUpdater,
							 joiner: IJoiner,
							 astUtil: ITypescriptASTUtil,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 remover: IRemover) {
		super(decoratorService, languageService, joiner, updater, remover, astUtil);
	}

	/**
	 * Returns true if the provided ExportDeclaration exports everything from the module it references
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {boolean}
	 */
	public isNamespaceExport (exportDeclaration: ExportDeclaration): boolean {
		return exportDeclaration.exportClause == null;
	}

	/**
	 * Gets all NamespaceExportDeclarations for the provided SourceFile
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {ExportDeclaration[]}
	 */
	public getNamespaceExports (sourceFile: SourceFile, deep?: boolean): ExportDeclaration[] {
		return this.getAll(sourceFile, deep).filter(exportDeclaration => this.isNamespaceExport(exportDeclaration));
	}

	/**
	 * Gets the ExportDeclaration that references the given NamedExport
	 * @param {INamedImportExportCtor | string} namedExport
	 * @param {SourceFile} sourceFile
	 * @param {string} path
	 * @returns {ExportDeclaration}
	 */
	public getExportWithNamedExport (namedExport: INamedImportExportCtor|string, sourceFile: SourceFile, path?: string): ExportDeclaration|undefined {
		const exports = path == null ? [...this.getAll(sourceFile)] : this.getExportsForPath(path, sourceFile);
		return exports.find(exportDeclaration => this.hasNamedExport(namedExport, exportDeclaration));
	}

	/**
	 * Gets all the ExportDeclarations that references the provided path
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {ExportDeclaration[]}
	 */
	public getExportsForPath (path: string, sourceFile: SourceFile): ExportDeclaration[] {
		const exports = this.getAll(sourceFile);
		return exports.filter(exportDeclaration => exportDeclaration.moduleSpecifier != null && isStringLiteral(exportDeclaration.moduleSpecifier) && exportDeclaration.moduleSpecifier.text === path);
	}

	/**
	 * Returns the NamedExports for the provided ExportDeclaration
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {NamedExports}
	 */
	public getNamedExportsForExportDeclaration (exportDeclaration: ExportDeclaration): NamedExports|undefined {
		return exportDeclaration.exportClause;
	}

	/**
	 * Gets the exported path for the given ExportDeclaration
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {string}
	 */
	public getPathForExportDeclaration (exportDeclaration: ExportDeclaration): string {
		// If it has no moduleSpecifier, the ExportDeclaration implicitly exports from the SourceFile that contains it
		if (exportDeclaration.moduleSpecifier == null) {
			return exportDeclaration.getSourceFile().fileName;
		}

		const literal = this.printer.print(exportDeclaration.moduleSpecifier);

		// Make sure to return the path unquoted
		return this.stringUtil.isQuoted(literal) ? literal.slice(1, literal.length - 1) : literal;
	}

	/**
	 * Returns true if the provided ExportDeclaration has a NamedExport matching the provided one
	 * @param {INamedImportExportCtor | string} namedExport
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {boolean}
	 */
	public hasNamedExport (namedExport: INamedImportExportCtor|string, exportDeclaration: ExportDeclaration): boolean {
		const namedExports = this.getNamedExportsForExportDeclaration(exportDeclaration);
		return namedExports != null && this.namedExportsService.hasExportWithName(namedExport, namedExports);
	}

	/**
	 * Changes the exported path for the given ExportDeclaration
	 * @param {string} path
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {ExportDeclaration}
	 */
	public changePathOfExportDeclaration (path: string, exportDeclaration: ExportDeclaration): ExportDeclaration {
		// If the ExportDeclaration already exports from the path, do nothing
		if (this.getPathForExportDeclaration(exportDeclaration) === path) {
			return exportDeclaration;
		}

		// Generate a StringLiteral for the path
		const moduleSpecifier = this.formatter.formatStringLiteral(path);

		return this.updater.updateExportDeclarationModuleSpecifier(moduleSpecifier, exportDeclaration);
	}

	/**
	 * Adds the given NamedExport to the given ExportDeclaration
	 * @param {INamedImportExportCtor} namedExport
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {ExportDeclaration}
	 */
	public addNamedExportToExportDeclaration (namedExport: INamedImportExportCtor, exportDeclaration: ExportDeclaration): ExportDeclaration {
		// If the ExportDeclaration already has that NamedExport, do nothing
		if (this.hasNamedExport(namedExport, exportDeclaration)) return exportDeclaration;

		// Format the new NamedExports
		const formatted = this.formatter.formatNamedExports(namedExport);

		return this.updater.updateExportDeclarationExportClause(
			this.joiner.joinNamedExports(formatted, exportDeclaration.exportClause),
			exportDeclaration
		);
	}

}