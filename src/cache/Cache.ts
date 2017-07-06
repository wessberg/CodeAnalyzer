import {ICache} from "./interface/ICache";
import {languageService} from "../services";
import {ClassIndexer, EnumIndexer, FunctionIndexer, IArrowFunction, ICachedContent, IClassDeclaration, IEnumDeclaration, IExportDeclaration, IFunctionDeclaration, IIdentifier, IIdentifierMap, IImportDeclaration, IPropDeclaration, IVariableDeclaration, ResolvedIIdentifierValueMap, ResolvedSerializedIIdentifierValueMap, VariableIndexer} from "../identifier/interface/IIdentifier";

export class Cache implements ICache {
	private cache: Map<string, ICachedContent<{}>> = new Map();

	public getCachedPropName (fileName: string, className: string, propName: string): string {
		return `prop.${fileName}.${className}.${propName}`;
	}

	public getCachedVariableName (fileName: string, variableName: string): string {
		return `variable.${fileName}.${variableName}`;
	}

	public getCachedEnumName (fileName: string, enumName: string): string {
		return `enum.${fileName}.${enumName}`;
	}

	public getCachedClassName (fileName: string, className: string): string {
		return `class.${fileName}.${className}`;
	}

	public getCachedFunctionName (fileName: string, functionName: string): string {
		return `function.${fileName}.${functionName}`;
	}

	public getCachedTracedIdentifierName (fileName: string, identifier: string, scope: string): string {
		return `function.${fileName}.${identifier}.${scope}`;
	}

	public getCachedIdentifierMapName (fileName: string): string {
		return `identifierMap.${fileName}`;
	}

	public getCachedResolvedIdentifierValueMapName (fileName: string): string {
		return `resolvedIdentifierValueMap.${fileName}`;
	}

	public getCachedResolvedSerializedIdentifierValueMapName (fileName: string): string {
		return `resolvedSerializedIdentifierValueMap.${fileName}`;
	}

	public getCachedClassIndexerName (fileName: string): string {
		return `classIndexer.${fileName}`;
	}

	public getCachedImportDeclarationsName (fileName: string): string {
		return `importDeclarations.${fileName}`;
	}

	public getCachedExportDeclarationsName (fileName: string): string {
		return `exportDeclarations.${fileName}`;
	}

	public getCachedArrowFunctionsName (fileName: string): string {
		return `arrowFunctions.${fileName}`;
	}

	public getCachedFunctionIndexerName (fileName: string): string {
		return `functionIndexer.${fileName}`;
	}

	public getCachedVariableIndexerName (fileName: string): string {
		return `variableIndexer.${fileName}`;
	}

	public getCachedEnumIndexerName (fileName: string): string {
		return `enumIndexer.${fileName}`;
	}

	public getFromCache<T> (key: string): ICachedContent<T>|null {
		const record = this.cache.get(key);
		return record == null ? null : <ICachedContent<T>>record;
	}

	public getCachedVariable (fileName: string, variableName: string): ICachedContent<IVariableDeclaration>|null {
		return this.getFromCache<IVariableDeclaration>(this.getCachedVariableName(fileName, variableName));
	}

	public getCachedFunction (fileName: string, functionName: string): ICachedContent<IFunctionDeclaration>|null {
		return this.getFromCache<IFunctionDeclaration>(this.getCachedFunctionName(fileName, functionName));
	}

	public getCachedTracedIdentifier (fileName: string, identifier: string, scope: string): ICachedContent<IIdentifier>|null {
		return this.getFromCache<IIdentifier>(this.getCachedTracedIdentifierName(fileName, identifier, scope));
	}

	public getCachedEnum (fileName: string, enumName: string): ICachedContent<IEnumDeclaration>|null {
		return this.getFromCache<IEnumDeclaration>(this.getCachedEnumName(fileName, enumName));
	}

	public getCachedProp (fileName: string, className: string, propName: string): ICachedContent<IPropDeclaration>|null {
		return this.getFromCache<IPropDeclaration>(this.getCachedPropName(fileName, className, propName));
	}

	public getCachedClass (fileName: string, className: string): ICachedContent<IClassDeclaration>|null {
		return this.getFromCache<IClassDeclaration>(this.getCachedClassName(fileName, className));
	}

	public getCachedFunctionIndexer (fileName: string): ICachedContent<FunctionIndexer>|null {
		return this.getFromCache<FunctionIndexer>(this.getCachedFunctionIndexerName(fileName));
	}

	public getCachedImportDeclarations (fileName: string): ICachedContent<IImportDeclaration[]>|null {
		return this.getFromCache<IImportDeclaration[]>(this.getCachedImportDeclarationsName(fileName));
	}

	public getCachedExportDeclarations (fileName: string): ICachedContent<IExportDeclaration[]>|null {
		return this.getFromCache<IExportDeclaration[]>(this.getCachedExportDeclarationsName(fileName));
	}

	public getCachedArrowFunctions (fileName: string): ICachedContent<IArrowFunction[]>|null {
		return this.getFromCache<IArrowFunction[]>(this.getCachedArrowFunctionsName(fileName));
	}

	public getCachedClassIndexer (fileName: string): ICachedContent<ClassIndexer>|null {
		return this.getFromCache<ClassIndexer>(this.getCachedClassIndexerName(fileName));
	}

	public getCachedEnumIndexer (fileName: string): ICachedContent<EnumIndexer>|null {
		return this.getFromCache<EnumIndexer>(this.getCachedEnumIndexerName(fileName));
	}

	public getCachedVariableIndexer (fileName: string): ICachedContent<VariableIndexer>|null {
		return this.getFromCache<VariableIndexer>(this.getCachedVariableIndexerName(fileName));
	}

	public getCachedIdentifierMap (fileName: string): ICachedContent<IIdentifierMap>|null {
		return this.getFromCache<IIdentifierMap>(this.getCachedIdentifierMapName(fileName));
	}

	public getCachedResolvedIdentifierValueMap (fileName: string): ICachedContent<ResolvedIIdentifierValueMap>|null {
		return this.getFromCache<ResolvedIIdentifierValueMap>(this.getCachedResolvedIdentifierValueMapName(fileName));
	}

	public getCachedResolvedSerializedIdentifierValueMap (fileName: string): ICachedContent<ResolvedSerializedIIdentifierValueMap>|null {
		return this.getFromCache<ResolvedSerializedIIdentifierValueMap>(this.getCachedResolvedSerializedIdentifierValueMapName(fileName));
	}

	public setCachedVariable (fileName: string, content: IVariableDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableName(fileName, content.name), {content, version});
	}

	public setCachedProp (fileName: string, content: IPropDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedPropName(fileName, content.className, content.name), {content, version});
	}

	public setCachedEnum (fileName: string, content: IEnumDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedEnumName(fileName, content.name), {content, version});
	}

	public setCachedClass (fileName: string, content: IClassDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedClassName(fileName, content.name), {version, content});
	}

	public setCachedFunction (fileName: string, content: IFunctionDeclaration): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedFunctionName(fileName, content.name), {version, content});
	}

	public setCachedTracedIdentifier (fileName: string, identifier: string, scope: string, content: IIdentifier): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedTracedIdentifierName(fileName, identifier, scope), {version, content});
	}

	public setCachedClassIndexer (fileName: string, content: ClassIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedClassIndexerName(fileName), {version, content});
	}

	public setCachedIdentifierMap (fileName: string, content: IIdentifierMap): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedIdentifierMapName(fileName), {version, content});
	}

	public setCachedResolvedIdentifierValueMap (fileName: string, content: ResolvedIIdentifierValueMap): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedResolvedIdentifierValueMapName(fileName), {version, content});
	}

	public setCachedResolvedSerializedIdentifierValueMap (fileName: string, content: ResolvedSerializedIIdentifierValueMap): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedResolvedSerializedIdentifierValueMapName(fileName), {version, content});
	}

	public setCachedFunctionIndexer (fileName: string, content: FunctionIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedFunctionIndexerName(fileName), {version, content});
	}

	public setCachedImportDeclarations (fileName: string, content: IImportDeclaration[]): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedImportDeclarationsName(fileName), {version, content});
	}

	public setCachedExportDeclarations (fileName: string, content: IExportDeclaration[]): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedExportDeclarationsName(fileName), {version, content});
	}

	public setCachedArrowFunctions (fileName: string, content: IArrowFunction[]): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedArrowFunctionsName(fileName), {version, content});
	}

	public setCachedEnumIndexer (fileName: string, content: EnumIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedEnumIndexerName(fileName), {version, content});
	}

	public setCachedVariableIndexer (fileName: string, content: VariableIndexer): void {
		const version = languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableIndexerName(fileName), {version, content});
	}

	public cachedVariableNeedsUpdate (variable: IVariableDeclaration): boolean {
		const cache = this.getCachedVariable(variable.filePath, variable.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(variable.filePath);
		return version > cache.version;
	}

	public cachedEnumNeedsUpdate (enumDeclaration: IEnumDeclaration): boolean {
		const cache = this.getCachedEnum(enumDeclaration.filePath, enumDeclaration.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(enumDeclaration.filePath);
		return version > cache.version;
	}

	public cachedFunctionNeedsUpdate (functionDeclaration: IFunctionDeclaration): boolean {
		const cache = this.getCachedFunction(functionDeclaration.filePath, functionDeclaration.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(functionDeclaration.filePath);
		return version > cache.version;
	}

	public cachedPropNeedsUpdate (prop: IPropDeclaration): boolean {
		const cache = this.getCachedProp(prop.filePath, prop.className, prop.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(prop.filePath);
		return version > cache.version;
	}

	public cachedClassNeedsUpdate (classDeclaration: IClassDeclaration): boolean {
		const cache = this.getCachedClass(classDeclaration.filePath, classDeclaration.name);
		if (cache == null) return true;

		const version = languageService.getFileVersion(classDeclaration.filePath);
		return version > cache.version;
	}

	public cachedFunctionIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedFunctionIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedIdentifierMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedIdentifierMap(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedTracedIdentifierNeedsUpdate (filePath: string, identifier: string, scope: string): boolean {
		const cache = this.getCachedTracedIdentifier(filePath, identifier, scope);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedResolvedIdentifierValueMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedResolvedIdentifierValueMap(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedResolvedSerializedIdentifierValueMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedResolvedIdentifierValueMap(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedImportDeclarationsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedImportDeclarations(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedExportDeclarationsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedExportDeclarations(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedArrowFunctionsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedArrowFunctions(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedClassIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedClassIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedEnumIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedEnumIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedVariableIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedVariableIndexer(filePath);
		if (cache == null) return true;

		const version = languageService.getFileVersion(filePath);
		return version > cache.version;
	}
}