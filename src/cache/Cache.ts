import {ICache} from "./interface/ICache";
import {languageService} from "../services";
import {IArrowFunction, ICachedContent, IClassDeclaration, IClassIndexer, IEnumDeclaration, IEnumIndexer, IExportDeclaration, IFunctionDeclaration, IFunctionIndexer, IIdentifier, IIdentifierMap, IImportDeclaration, IPropDeclaration, IResolvedIIdentifierValueMap, IResolvedSerializedIIdentifierValueMap, IVariableDeclaration, IVariableIndexer} from "../identifier/interface/IIdentifier";

/**
 * A class that can cache previously computed and resolved values and identifiers to reduce operation cost later on.
 */
export class Cache implements ICache {
	/**
	 * A Map between unique cache keys and ICachedContent.
	 * @type {Map<string, ICachedContent<{}>>}
	 */
	private cache: Map<string, ICachedContent<{}>> = new Map();

	/**
	 * Gets a unique key name for a prop.
	 * @param {string} fileName
	 * @param {string} className
	 * @param {string} propName
	 * @returns {string}
	 */
	public getCachedPropName (fileName: string, className: string, propName: string): string {
		return `prop.${fileName}.${className}.${propName}`;
	}

	/**
	 * Gets a unique key name for a variable.
	 * @param {string} fileName
	 * @param {string} variableName
	 * @returns {string}
	 */
	public getCachedVariableName (fileName: string, variableName: string): string {
		return `variable.${fileName}.${variableName}`;
	}

	/**
	 * Gets a unique key name for an enum
	 * @param {string} fileName
	 * @param {string} enumName
	 * @returns {string}
	 */
	public getCachedEnumName (fileName: string, enumName: string): string {
		return `enum.${fileName}.${enumName}`;
	}

	/**
	 * Gets a unique key name for a class.
	 * @param {string} fileName
	 * @param {string} className
	 * @returns {string}
	 */
	public getCachedClassName (fileName: string, className: string): string {
		return `class.${fileName}.${className}`;
	}

	/**
	 * Gets a unique key name for a function.
	 * @param {string} fileName
	 * @param {string} functionName
	 * @returns {string}
	 */
	public getCachedFunctionName (fileName: string, functionName: string): string {
		return `function.${fileName}.${functionName}`;
	}

	/**
	 * Gets a unique key name for a traced identifier.
	 * @param {string} fileName
	 * @param {string} identifier
	 * @param {string} scope
	 * @returns {string}
	 */
	public getCachedTracedIdentifierName (fileName: string, identifier: string, scope: string): string {
		return `tracedIdentifier.${fileName}.${identifier}.${scope}`;
	}

	/**
	 * Gets a unique key name for a identifier map.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedIdentifierMapName (fileName: string): string {
		return `identifierMap.${fileName}`;
	}

	/**
	 * Gets a unique key name for a resolved identifier value map.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedResolvedIdentifierValueMapName (fileName: string): string {
		return `resolvedIdentifierValueMap.${fileName}`;
	}

	/**
	 * Gets a unique key name for a resolved serialized identifier value map.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedResolvedSerializedIdentifierValueMapName (fileName: string): string {
		return `resolvedSerializedIdentifierValueMap.${fileName}`;
	}

	/**
	 * Gets a unique key name for a class indexer.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedClassIndexerName (fileName: string): string {
		return `classIndexer.${fileName}`;
	}

	/**
	 * Gets a unique key name for an array of import declarations.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedImportDeclarationsName (fileName: string): string {
		return `importDeclarations.${fileName}`;
	}

	/**
	 * Gets a unique key name for an array of export declarations.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedExportDeclarationsName (fileName: string): string {
		return `exportDeclarations.${fileName}`;
	}

	/**
	 * Gets a unique key name for an array of arrow functions.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedArrowFunctionsName (fileName: string): string {
		return `arrowFunctions.${fileName}`;
	}

	/**
	 * Gets a unique key name for a function indexer.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedFunctionIndexerName (fileName: string): string {
		return `functionIndexer.${fileName}`;
	}

	/**
	 * Gets a unique key name for a variable indexer.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedVariableIndexerName (fileName: string): string {
		return `variableIndexer.${fileName}`;
	}

	/**
	 * Gets a unique key name for an enum indexer
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getCachedEnumIndexerName (fileName: string): string {
		return `enumIndexer.${fileName}`;
	}

	/**
	 * Gets some cached content from the cache, if it exists.
	 * @param {string} key
	 * @returns {ICachedContent<T>|null}
	 */
	public getFromCache<T> (key: string): ICachedContent<T>|null {
		const record = this.cache.get(key);
		return record == null ? null : <ICachedContent<T>>record;
	}

	/**
	 * Gets a cached variable, if it exists.
	 * @param {string} fileName
	 * @param {string} variableName
	 * @returns {ICachedContent<IVariableDeclaration>|null}
	 */
	public getCachedVariable (fileName: string, variableName: string): ICachedContent<IVariableDeclaration>|null {
		return this.getFromCache<IVariableDeclaration>(this.getCachedVariableName(fileName, variableName));
	}

	/**
	 * Gets a cached function, if it exists
	 * @param {string} fileName
	 * @param {string} functionName
	 * @returns {ICachedContent<IFunctionDeclaration>|null}
	 */
	public getCachedFunction (fileName: string, functionName: string): ICachedContent<IFunctionDeclaration>|null {
		return this.getFromCache<IFunctionDeclaration>(this.getCachedFunctionName(fileName, functionName));
	}

	/**
	 * Gets a cached traced identifier, if it exists
	 * @param {string} fileName
	 * @param {string} identifier
	 * @param {string} scope
	 * @returns {ICachedContent<IIdentifier>|null}
	 */
	public getCachedTracedIdentifier (fileName: string, identifier: string, scope: string): ICachedContent<IIdentifier>|null {
		return this.getFromCache<IIdentifier>(this.getCachedTracedIdentifierName(fileName, identifier, scope));
	}

	/**
	 * Gets a cached enum, if it exists
	 * @param {string} fileName
	 * @param {string} enumName
	 * @returns {ICachedContent<IEnumDeclaration>|null}
	 */
	public getCachedEnum (fileName: string, enumName: string): ICachedContent<IEnumDeclaration>|null {
		return this.getFromCache<IEnumDeclaration>(this.getCachedEnumName(fileName, enumName));
	}

	/**
	 * Gets a cached prop, if it exists
	 * @param {string} fileName
	 * @param {string} className
	 * @param {string} propName
	 * @returns {ICachedContent<IPropDeclaration>|null}
	 */
	public getCachedProp (fileName: string, className: string, propName: string): ICachedContent<IPropDeclaration>|null {
		return this.getFromCache<IPropDeclaration>(this.getCachedPropName(fileName, className, propName));
	}

	/**
	 * Gets a cached class, if it exists
	 * @param {string} fileName
	 * @param {string} className
	 * @returns {ICachedContent<IClassDeclaration>|null}
	 */
	public getCachedClass (fileName: string, className: string): ICachedContent<IClassDeclaration>|null {
		return this.getFromCache<IClassDeclaration>(this.getCachedClassName(fileName, className));
	}

	/**
	 * Gets a cached function indexer, if it exists
	 * @param {string} fileName
	 * @returns {ICachedContent<IFunctionIndexer>|null}
	 */
	public getCachedFunctionIndexer (fileName: string): ICachedContent<IFunctionIndexer>|null {
		return this.getFromCache<IFunctionIndexer>(this.getCachedFunctionIndexerName(fileName));
	}

	/**
	 * Gets an array of cached import declarations for a file, if they exist.
	 * @param {string} fileName
	 * @returns {ICachedContent<IImportDeclaration[]>|null}
	 */
	public getCachedImportDeclarations (fileName: string): ICachedContent<IImportDeclaration[]>|null {
		return this.getFromCache<IImportDeclaration[]>(this.getCachedImportDeclarationsName(fileName));
	}

	/**
	 * Gets an array of cached export declarations for a file, if they exist.
	 * @param {string} fileName
	 * @returns {ICachedContent<IExportDeclaration[]>|null}
	 */
	public getCachedExportDeclarations (fileName: string): ICachedContent<IExportDeclaration[]>|null {
		return this.getFromCache<IExportDeclaration[]>(this.getCachedExportDeclarationsName(fileName));
	}

	/**
	 * Gets an array of cached arrow functions for a file, if they exist.
	 * @param {string} fileName
	 * @returns {ICachedContent<IArrowFunction[]>|null}
	 */
	public getCachedArrowFunctions (fileName: string): ICachedContent<IArrowFunction[]>|null {
		return this.getFromCache<IArrowFunction[]>(this.getCachedArrowFunctionsName(fileName));
	}

	/**
	 * Gets a cached class indexer, if it exists.
	 * @param {string} fileName
	 * @returns {ICachedContent<IClassIndexer>|null}
	 */
	public getCachedClassIndexer (fileName: string): ICachedContent<IClassIndexer>|null {
		return this.getFromCache<IClassIndexer>(this.getCachedClassIndexerName(fileName));
	}

	/**
	 * Gets a cached enum indexer, if it exists.
	 * @param {string} fileName
	 * @returns {ICachedContent<IEnumIndexer>|null}
	 */
	public getCachedEnumIndexer (fileName: string): ICachedContent<IEnumIndexer>|null {
		return this.getFromCache<IEnumIndexer>(this.getCachedEnumIndexerName(fileName));
	}

	/**
	 * Gets a cached variable indexer, if it exists.
	 * @param {string} fileName
	 * @returns {ICachedContent<IVariableIndexer>|null}
	 */
	public getCachedVariableIndexer (fileName: string): ICachedContent<IVariableIndexer>|null {
		return this.getFromCache<IVariableIndexer>(this.getCachedVariableIndexerName(fileName));
	}

	/**
	 * Gets a cached identifier map, if it exists.
	 * @param {string} fileName
	 * @returns {ICachedContent<IIdentifierMap>|null}
	 */
	public getCachedIdentifierMap (fileName: string): ICachedContent<IIdentifierMap>|null {
		return this.getFromCache<IIdentifierMap>(this.getCachedIdentifierMapName(fileName));
	}

	/**
	 * Gets a cached resolved identifier value map, if it exists.
	 * @param {string} fileName
	 * @returns {ICachedContent<IResolvedIIdentifierValueMap>|null}
	 */
	public getCachedResolvedIdentifierValueMap (fileName: string): ICachedContent<IResolvedIIdentifierValueMap>|null {
		return this.getFromCache<IResolvedIIdentifierValueMap>(this.getCachedResolvedIdentifierValueMapName(fileName));
	}

	/**
	 * Gets a cached resolved serialized identifier value map, if it exists.
	 * @param {string} fileName
	 * @returns {ICachedContent<IResolvedSerializedIIdentifierValueMap>|null}
	 */
	public getCachedResolvedSerializedIdentifierValueMap (fileName: string): ICachedContent<IResolvedSerializedIIdentifierValueMap>|null {
		return this.getFromCache<IResolvedSerializedIIdentifierValueMap>(this.getCachedResolvedSerializedIdentifierValueMapName(fileName));
	}

	/**
	 * Sets a cached variable.
	 * @param {string} fileName
	 * @param {IVariableDeclaration} content
	 */
	public setCachedVariable (fileName: string, content: IVariableDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableName(fileName, content.name), {content, version});
	}

	/**
	 * Sets a cached prop.
	 * @param {string} fileName
	 * @param {IPropDeclaration} content
	 */
	public setCachedProp (fileName: string, content: IPropDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedPropName(fileName, content.className, content.name), {content, version});
	}

	/**
	 * Sets a cached enum.
	 * @param {string} fileName
	 * @param {IEnumDeclaration} content
	 */
	public setCachedEnum (fileName: string, content: IEnumDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedEnumName(fileName, content.name), {content, version});
	}

	/**
	 * Sets a cached class.
	 * @param {string} fileName
	 * @param {IClassDeclaration} content
	 */
	public setCachedClass (fileName: string, content: IClassDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedClassName(fileName, content.name), {version, content});
	}

	/**
	 * Sets a cached function.
	 * @param {string} fileName
	 * @param {IFunctionDeclaration} content
	 */
	public setCachedFunction (fileName: string, content: IFunctionDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedFunctionName(fileName, content.name), {version, content});
	}

	/**
	 * Sets a cached traced identifier.
	 * @param {string} fileName
	 * @param {string} identifier
	 * @param {string} scope
	 * @param {IIdentifier} content
	 */
	public setCachedTracedIdentifier (fileName: string, identifier: string, scope: string, content: IIdentifier): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedTracedIdentifierName(fileName, identifier, scope), {version, content});
	}

	/**
	 * Sets a cached class indexer.
	 * @param {string} fileName
	 * @param {IClassIndexer} content
	 */
	public setCachedClassIndexer (fileName: string, content: IClassIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedClassIndexerName(fileName), {version, content});
	}

	/**
	 * Sets a cached identifier map.
	 * @param {string} fileName
	 * @param {IIdentifierMap} content
	 */
	public setCachedIdentifierMap (fileName: string, content: IIdentifierMap): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedIdentifierMapName(fileName), {version, content});
	}

	/**
	 * Sets a cached resolved identifier value map.
	 * @param {string} fileName
	 * @param {IResolvedIIdentifierValueMap} content
	 */
	public setCachedResolvedIdentifierValueMap (fileName: string, content: IResolvedIIdentifierValueMap): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedResolvedIdentifierValueMapName(fileName), {version, content});
	}

	/**
	 * Sets a cached resolved serialized identifier value map.
	 * @param {string} fileName
	 * @param {IResolvedSerializedIIdentifierValueMap} content
	 */
	public setCachedResolvedSerializedIdentifierValueMap (fileName: string, content: IResolvedSerializedIIdentifierValueMap): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedResolvedSerializedIdentifierValueMapName(fileName), {version, content});
	}

	/**
	 * Sets a cached function indexer.
	 * @param {string} fileName
	 * @param {IFunctionIndexer} content
	 */
	public setCachedFunctionIndexer (fileName: string, content: IFunctionIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedFunctionIndexerName(fileName), {version, content});
	}

	/**
	 * Sets an array of cached import declarations
	 * @param {string} fileName
	 * @param {IImportDeclaration[]} content
	 */
	public setCachedImportDeclarations (fileName: string, content: IImportDeclaration[]): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedImportDeclarationsName(fileName), {version, content});
	}

	/**
	 * Sets an array of cached export declarations
	 * @param {string} fileName
	 * @param {IExportDeclaration[]} content
	 */
	public setCachedExportDeclarations (fileName: string, content: IExportDeclaration[]): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedExportDeclarationsName(fileName), {version, content});
	}

	/**
	 * Sets an array of cached arrow functions
	 * @param {string} fileName
	 * @param {IArrowFunction[]} content
	 */
	public setCachedArrowFunctions (fileName: string, content: IArrowFunction[]): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedArrowFunctionsName(fileName), {version, content});
	}

	/**
	 * Sets a cached enum indexer
	 * @param {string} fileName
	 * @param {IEnumIndexer} content
	 */
	public setCachedEnumIndexer (fileName: string, content: IEnumIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedEnumIndexerName(fileName), {version, content});
	}

	/**
	 * Sets a cached variable indexer
	 * @param {string} fileName
	 * @param {IVariableIndexer} content
	 */
	public setCachedVariableIndexer (fileName: string, content: IVariableIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableIndexerName(fileName), {version, content});
	}

	/**
	 * Returns true if a given IVariableDeclaration needs to be updated (e.g. the cache is invalidated).
	 * @param {IVariableDeclaration} variable
	 * @returns {boolean}
	 */
	public cachedVariableNeedsUpdate (variable: IVariableDeclaration): boolean {
		const cache = this.getCachedVariable(variable.filePath, variable.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(variable.filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a given IEnumDeclaration needs to be updated (e.g. the cache is invalidated).
	 * @param {IEnumDeclaration} enumDeclaration
	 * @returns {boolean}
	 */
	public cachedEnumNeedsUpdate (enumDeclaration: IEnumDeclaration): boolean {
		const cache = this.getCachedEnum(enumDeclaration.filePath, enumDeclaration.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(enumDeclaration.filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a given IFunctionDeclaration needs to be updated (e.g. the cache is invalidated).
	 * @param {IFunctionDeclaration} functionDeclaration
	 * @returns {boolean}
	 */
	public cachedFunctionNeedsUpdate (functionDeclaration: IFunctionDeclaration): boolean {
		const cache = this.getCachedFunction(functionDeclaration.filePath, functionDeclaration.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(functionDeclaration.filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a given IPropDeclaration needs to be updated (e.g. the cache is invalidated).
	 * @param {IPropDeclaration} prop
	 * @returns {boolean}
	 */
	public cachedPropNeedsUpdate (prop: IPropDeclaration): boolean {
		const cache = this.getCachedProp(prop.filePath, prop.className, prop.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(prop.filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a given IClassDeclaration needs to be updated (e.g. the cache is invalidated).
	 * @param {IClassDeclaration} classDeclaration
	 * @returns {boolean}
	 */
	public cachedClassNeedsUpdate (classDeclaration: IClassDeclaration): boolean {
		const cache = this.getCachedClass(classDeclaration.filePath, classDeclaration.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(classDeclaration.filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if an IFunctionIndexer for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedFunctionIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedFunctionIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a IdentifierMap for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedIdentifierMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedIdentifierMap(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a TracedIdentifier for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @param {string} identifier
	 * @param {string} scope
	 * @returns {boolean}
	 */
	public cachedTracedIdentifierNeedsUpdate (filePath: string, identifier: string, scope: string): boolean {
		const cache = this.getCachedTracedIdentifier(filePath, identifier, scope);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a ResolvedIdentifierValueMap for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedResolvedIdentifierValueMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedResolvedIdentifierValueMap(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if a ResolvedSerializedIdentifierValueMap for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedResolvedSerializedIdentifierValueMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedResolvedIdentifierValueMap(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if the import declarations for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedImportDeclarationsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedImportDeclarations(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if the export declarations for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedExportDeclarationsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedExportDeclarations(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if the arrow functions for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedArrowFunctionsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedArrowFunctions(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if the class indexer for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedClassIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedClassIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if the enum indexer for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedEnumIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedEnumIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	/**
	 * Returns true if the variable indexer for a file needs to be updated (e.g. the cache is invalidated).
	 * @param {string} filePath
	 * @returns {boolean}
	 */
	public cachedVariableIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedVariableIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}
}