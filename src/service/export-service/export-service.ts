import {IFormattedExport} from "@wessberg/type";
import {createNodeArray, ExportDeclaration, NodeArray, SyntaxKind} from "typescript";
import {AstNode} from "../../type/ast-node/ast-node";
import {IExportService} from "./i-export-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";
import {ExportFormatterGetter} from "../../formatter/expression/export-formatter/export-formatter-getter";

/**
 * A class that can generate exports
 */
export class ExportService implements IExportService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.ExportDeclaration]);

	/**
	 * A Set of all files that is currently being checked for exports
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForExports: Set<string> = new Set();

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private cacheService: CacheServiceGetter,
							 private exportFormatter: ExportFormatterGetter) {
	}

	/**
	 * Returns true if the given file is currently being analyzed for exports
	 * @param {string} file
	 * @returns {boolean}
	 */
	public isGettingExportsForFile (file: string): boolean {
		return this.filesBeingAnalyzedForExports.has(file);
	}

	/**
	 * Gets all IFormattedExports for the given file
	 * @param {string} file
	 * @returns {IFormattedExport[]}
	 */
	public getExportsForFile (file: string): IFormattedExport[] {
		const pathInfo = this.languageService.getPathInfo({path: file});
		const statements = this.languageService.addFile(pathInfo);

		// If Exports are currently being analyzed for the file, return an empty array
		if (this.isGettingExportsForFile(pathInfo.normalizedPath)) return [];

		// Refresh the Exports if required
		if (this.cacheService().cachedExportsNeedsUpdate(pathInfo.normalizedPath)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForExports.add(pathInfo.normalizedPath);

			// Get the Exports
			const exports = this.getExportsForStatements(statements);

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForExports.delete(pathInfo.normalizedPath);

			// Cache and return the Exports
			return this.cacheService().setCachedExportsForFile(pathInfo.normalizedPath, exports);
		}
		// Otherwise, return the cached Exports
		else {
			return this.cacheService().getCachedExportsForFile(pathInfo.normalizedPath)!;
		}
	}

	/**
	 * Gets all IFormattedExports for the given statement
	 * @param {ExportDeclaration} statement
	 * @returns {IFormattedExport[]}
	 */
	public getExportsForStatement (statement: ExportDeclaration): IFormattedExport[] {
		return this.getExportsForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all IFormattedExports for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedExport[]}
	 */
	public getExportsForStatements (statements: NodeArray<AstNode>): IFormattedExport[] {
		const expressions: IFormattedExport[] = [];
		const formatter = this.exportFormatter();
		this.astUtil.filterStatements<ExportDeclaration>(expression => expressions.push(formatter.format(expression)), statements, this.supportedKinds, true);
		return expressions;
	}
}