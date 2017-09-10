import {ICacheService} from "./i-cache-service";
import {FormattedFunction, IFormattedCallExpression, IFormattedClass, IFormattedIdentifier, IFormattedImport, IFormattedInterfaceType} from "@wessberg/type";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";

/**
 * A class that can cache expressions
 */
export class CacheService implements ICacheService {
	/**
	 * A class between file names and cached formatted classes
	 * @type {Map<string, IFormattedClass[]>}
	 */
	private cachedClassesMap: Map<string, IFormattedClass[]> = new Map();
	/**
	 * A class between file names and cached formatted call expressions
	 * @type {Map<string, IFormattedCallExpression[]>}
	 */
	private cachedCallExpressionsMap: Map<string, IFormattedCallExpression[]> = new Map();
	/**
	 * A class between file names and cached formatted functions
	 * @type {Map<string, FormattedFunction[]>}
	 */
	private cachedFunctionsMap: Map<string, FormattedFunction[]> = new Map();
	/**
	 * A class between file names and cached formatted identifiers
	 * @type {Map<string, IFormattedIdentifier[]>}
	 */
	private cachedIdentifiersMap: Map<string, IFormattedIdentifier[]> = new Map();
	/**
	 * A class between file names and cached import paths
	 * @type {Map<string, string[]>}
	 */
	private cachedImportsMap: Map<string, IFormattedImport[]> = new Map();
	/**
	 * A class between file names and cached formatted interfaces
	 * @type {Map<string, IFormattedInterfaceType[]>}
	 */
	private cachedInterfacesMap: Map<string, IFormattedInterfaceType[]> = new Map();
	/**
	 * A Map between file names and the cached versions of their classes
	 * @type {Map<string, number>}
	 */
	private cachedClassVersions: Map<string, number> = new Map();
	/**
	 * A Map between file names and the cached versions of their call expressions
	 * @type {Map<string, number>}
	 */
	private cachedCallExpressionVersions: Map<string, number> = new Map();
	/**
	 * A Map between file names and the cached versions of their functions
	 * @type {Map<string, number>}
	 */
	private cachedFunctionVersions: Map<string, number> = new Map();
	/**
	 * A Map between file names and the cached versions of their identifiers
	 * @type {Map<string, number>}
	 */
	private cachedIdentifierVersions: Map<string, number> = new Map();
	/**
	 * A Map between file names and the cached versions of their imports
	 * @type {Map<string, number>}
	 */
	private cachedImportVersions: Map<string, number> = new Map();
	/**
	 * A Map between file names and the cached versions of their interfaces
	 * @type {Map<string, number>}
	 */
	private cachedInterfaceVersions: Map<string, number> = new Map();

	constructor (private languageService: ITypescriptLanguageService) {
	}

	/**
	 * Returns true if classes for the given file needs an update
	 * @param {string} file
	 * @returns {boolean}
	 */
	public cachedClassesNeedsUpdate (file: string): boolean {
		return this.cacheNeedsUpdate(file, this.cachedClassVersions.get(file));
	}

	/**
	 * Returns true if call expressions for the given file needs an update
	 * @param {string} file
	 * @returns {boolean}
	 */
	public cachedCallExpressionsNeedsUpdate (file: string): boolean {
		return this.cacheNeedsUpdate(file, this.cachedCallExpressionVersions.get(file));
	}

	/**
	 * Returns true if functions for the given file needs an update
	 * @param {string} file
	 * @returns {boolean}
	 */
	public cachedFunctionsNeedsUpdate (file: string): boolean {
		return this.cacheNeedsUpdate(file, this.cachedFunctionVersions.get(file));
	}

	/**
	 * Returns true if identifiers for the given file needs an update
	 * @param {string} file
	 * @returns {boolean}
	 */
	public cachedIdentifiersNeedsUpdate (file: string): boolean {
		return this.cacheNeedsUpdate(file, this.cachedIdentifierVersions.get(file));
	}

	/**
	 * Returns true if import paths for the given file needs an update
	 * @param {string} file
	 * @returns {boolean}
	 */
	public cachedImportsNeedsUpdate (file: string): boolean {
		return this.cacheNeedsUpdate(file, this.cachedImportVersions.get(file));
	}

	/**
	 * Returns true if interface declarations for the given file needs an update
	 * @param {string} file
	 * @returns {boolean}
	 */
	public cachedInterfacesNeedsUpdate (file: string): boolean {
		return this.cacheNeedsUpdate(file, this.cachedInterfaceVersions.get(file));
	}

	/**
	 * Sets the provided IFormattedClasses for the provided file
	 * @param {string} file
	 * @param {IFormattedClass[]} classes
	 * @returns {IFormattedClass[]}
	 */
	public setCachedClassesForFile (file: string, classes: IFormattedClass[]): IFormattedClass[] {
		// Update the cached class map with the new items
		this.cachedClassesMap.set(file, classes);

		// Update the cached version
		this.cachedClassVersions.set(file, this.languageService.getFileVersion(file));
		return classes;
	}

	/**
	 * Sets the provided IFormattedCallExpressions for the provided file
	 * @param {string} file
	 * @param {IFormattedCallExpression[]} callExpressions
	 * @returns {IFormattedCallExpression[]}
	 */
	public setCachedCallExpressionsForFile (file: string, callExpressions: IFormattedCallExpression[]): IFormattedCallExpression[] {
		// Update the cached call expression map with the new items
		this.cachedCallExpressionsMap.set(file, callExpressions);

		// Update the cached version
		this.cachedCallExpressionVersions.set(file, this.languageService.getFileVersion(file));
		return callExpressions;
	}

	/**
	 * Sets the provided FormattedFunctions for the provided file
	 * @param {string} file
	 * @param {FormattedFunction[]} functions
	 * @returns {FormattedFunction[]}
	 */
	public setCachedFunctionsForFile (file: string, functions: FormattedFunction[]): FormattedFunction[] {
		// Update the cached function map with the new items
		this.cachedFunctionsMap.set(file, functions);

		// Update the cached version
		this.cachedFunctionVersions.set(file, this.languageService.getFileVersion(file));
		return functions;
	}

	/**
	 * Sets the provided IFormattedIdentifiers for the provided file
	 * @param {string} file
	 * @param {IFormattedIdentifier[]} identifiers
	 * @returns {IFormattedIdentifier[]}
	 */
	public setCachedIdentifiersForFile (file: string, identifiers: IFormattedIdentifier[]): IFormattedIdentifier[] {
		// Update the cached identifier map with the new items
		this.cachedIdentifiersMap.set(file, identifiers);

		// Update the cached version
		this.cachedIdentifierVersions.set(file, this.languageService.getFileVersion(file));
		return identifiers;
	}

	/**
	 * Sets the provided cached imports for the provided file
	 * @param {string} file
	 * @param {IFormattedImport[]} imports
	 * @returns {IFormattedImport[]}
	 */
	public setCachedImportsForFile (file: string, imports: IFormattedImport[]): IFormattedImport[] {
		// Update the cached import map with the new items
		this.cachedImportsMap.set(file, imports);

		// Update the cached version
		this.cachedImportVersions.set(file, this.languageService.getFileVersion(file));
		return imports;
	}

	/**
	 * Sets the provided IFormattedInterfaceTypes for the provided file
	 * @param {string} file
	 * @param {IFormattedInterfaceType[]} interfaces
	 * @returns {IFormattedInterfaceType[]}
	 */
	public setCachedInterfacesForFile (file: string, interfaces: IFormattedInterfaceType[]): IFormattedInterfaceType[] {
		// Update the cached interface map with the new items
		this.cachedInterfacesMap.set(file, interfaces);

		// Update the cached version
		this.cachedInterfaceVersions.set(file, this.languageService.getFileVersion(file));
		return interfaces;
	}

	/**
	 * Gets all cached IFormattedClasses for the given file
	 * @param {string} file
	 * @returns {IFormattedClass[]}
	 */
	public getCachedClassesForFile (file: string): IFormattedClass[]|undefined {
		return this.cachedClassesMap.get(file);
	}

	/**
	 * Gets all cached IFormattedCallExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCachedCallExpressionsForFile (file: string): IFormattedCallExpression[]|undefined {
		return this.cachedCallExpressionsMap.get(file);
	}

	/**
	 * Gets all cached FormattedFunctions for the given file
	 * @param {string} file
	 * @returns {FormattedFunction[]}
	 */
	public getCachedFunctionsForFile (file: string): FormattedFunction[]|undefined {
		return this.cachedFunctionsMap.get(file);
	}

	/**
	 * Gets all cached IFormattedIdentifiers for the given file
	 * @param {string} file
	 * @returns {IFormattedIdentifier[]}
	 */
	public getCachedIdentifiersForFile (file: string): IFormattedIdentifier[]|undefined {
		return this.cachedIdentifiersMap.get(file);
	}

	/**
	 * Gets all cached import paths for the given file
	 * @param {string} file
	 * @returns {IFormattedImport[]}
	 */
	public getCachedImportsForFile (file: string): IFormattedImport[]|undefined {
		return this.cachedImportsMap.get(file);
	}

	/**
	 * Gets all cached IFormattedInterfaceTypes for the given file
	 * @param {string} file
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getCachedInterfacesForFile (file: string): IFormattedInterfaceType[]|undefined {
		return this.cachedInterfacesMap.get(file);
	}

	/**
	 * Returns true if some cached version needs an update
	 * @param {string} file
	 * @param {number?} cachedVersion
	 * @returns {boolean}
	 */
	private cacheNeedsUpdate (file: string, cachedVersion: number|undefined): boolean {
		const currentVersion = this.languageService.getFileVersion(file);
		// Return true if there is no cached version or if it is older than the current version of the file
		return cachedVersion == null || cachedVersion < currentVersion;
	}

}