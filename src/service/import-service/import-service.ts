import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IImportService} from "./i-import-service";
import {createNodeArray, ImportDeclaration, NodeArray, SyntaxKind} from "typescript";
import {IFormattedImport} from "@wessberg/type";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";
import {AstNode} from "../../type/ast-node/ast-node";
import {ImportFormatterGetter} from "../../formatter/expression/import-formatter/import-formatter-getter";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class that can generate imports
 */
export class ImportService implements IImportService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.ImportDeclaration]);

	/**
	 * A Set of all files that is currently being checked for imports
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForImports: Set<string> = new Set();

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private cacheService: CacheServiceGetter,
							 private importFormatter: ImportFormatterGetter) {
	}

	/**
	 * Returns true if the given file is currently being analyzed for imports
	 * @param {string} file
	 * @returns {boolean}
	 */
	public isGettingImportsForFile (file: string): boolean {
		return this.filesBeingAnalyzedForImports.has(file);
	}

	/**
	 * Gets all IFormattedImports for the given file
	 * @param {string} file
	 * @param {string} [content]
	 * @returns {IFormattedImport[]}
	 */
	public getImportsForFile (file: string, content?: string): IFormattedImport[] {
		const pathInfo = this.languageService.getPathInfo({path: file, content});
		const statements = this.languageService.addFile(pathInfo);

		// If imports are currently being analyzed for the file, return an empty array
		if (this.isGettingImportsForFile(pathInfo.normalizedPath)) return [];

		// Refresh the imports if required
		if (this.cacheService().cachedImportsNeedsUpdate(pathInfo.normalizedPath)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForImports.add(pathInfo.normalizedPath);

			// Get the imports
			const imports = this.getImportsForStatements(statements);

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForImports.delete(pathInfo.normalizedPath);

			// Cache and return the imports
			return this.cacheService().setCachedImportsForFile(pathInfo.normalizedPath, imports);
		}
		// Otherwise, return the cached imports
		else {
			return this.cacheService().getCachedImportsForFile(pathInfo.normalizedPath)!;
		}
	}

	/**
	 * Gets all IFormattedImports for the given statement
	 * @param {ImportDeclaration} statement
	 * @returns {IFormattedImport[]}
	 */
	public getImportsForStatement (statement: ImportDeclaration): IFormattedImport[] {
		return this.getImportsForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all IFormattedImports for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedImport[]}
	 */
	public getImportsForStatements (statements: NodeArray<AstNode>): IFormattedImport[] {
		const expressions: IFormattedImport[] = [];
		const formatter = this.importFormatter();
		this.astUtil.filterStatements<ImportDeclaration>(expression => expressions.push(formatter.format(expression)), statements, this.supportedKinds, true);
		return expressions;
	}
}