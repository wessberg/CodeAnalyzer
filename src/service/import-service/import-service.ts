import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IImportService} from "./i-import-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";

/**
 * A class that can generate imports
 */
export class ImportService implements IImportService {

	/**
	 * A Set of all files that is currently being checked for functions
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForImports: Set<string> = new Set();

	constructor (private languageService: ITypescriptLanguageService,
							 private cacheService: CacheServiceGetter) {
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
	 * Gets all imported files for the given file
	 * @param {string} file
	 * @returns {string[]}
	 */
	public getImportedFilesForFile (file: string): string[] {
		// Refresh the imports if required
		if (this.cacheService().cachedImportsNeedsUpdate(file)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForImports.add(file);

			// Get the imports
			const imports = this.languageService.getImportedFilesForFile(file);

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForImports.delete(file);

			// Cache and return the imports
			return this.cacheService().setCachedImportsForFile(file, imports);
		}
		// Otherwise, return the cached imports
		else {
			return this.cacheService().getCachedImportsForFile(file)!;
		}
	}

	/**
	 * Gets all imported files for the file holding the provided statement
	 * @param {AstNode} statement
	 * @returns {string[]}
	 */
	public getImportedFilesForStatementFile (statement: AstNode): string[] {
		return this.languageService.getImportedFilesForStatementFile(statement);
	}
}