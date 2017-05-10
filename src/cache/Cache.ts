import {ICache} from "./interface/ICache";
import {ICachedContent, IFunctionDeclaration, IVariableAssignment, IEnumDeclaration, IPropDeclaration, IClassDeclaration, FunctionIndexer, IImportDeclaration, ClassIndexer, EnumIndexer, VariableIndexer, ISimpleLanguageService} from "../interface/ISimpleLanguageService";

export class Cache implements ICache {
	private cache: Map<string, ICachedContent<{}>> = new Map();
	
	constructor (private languageService: ISimpleLanguageService) {}

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

	public getCachedFunctionName (fileName: string, className: string): string {
		return `function.${fileName}.${className}`;
	}

	public getCachedClassIndexerName (fileName: string): string {
		return `classIndexer.${fileName}`;
	}

	public getCachedModuleDependenciesName (fileName: string): string {
		return `moduleDependencies.${fileName}`;
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

	public getFromCache<T> (key: string): ICachedContent<T> | null {
		const record = this.cache.get(key);
		return record == null ? null : <ICachedContent<T>>record;
	}

	public getCachedVariable (fileName: string, variableName: string): ICachedContent<IVariableAssignment> | null {
		return this.getFromCache<IVariableAssignment>(this.getCachedVariableName(fileName, variableName));
	}

	public getCachedFunction (fileName: string, functionName: string): ICachedContent<IFunctionDeclaration> | null {
		return this.getFromCache<IFunctionDeclaration>(this.getCachedFunctionName(fileName, functionName));
	}

	public getCachedEnum (fileName: string, enumName: string): ICachedContent<IEnumDeclaration> | null {
		return this.getFromCache<IEnumDeclaration>(this.getCachedEnumName(fileName, enumName));
	}

	public getCachedProp (fileName: string, className: string, propName: string): ICachedContent<IPropDeclaration> | null {
		return this.getFromCache<IPropDeclaration>(this.getCachedPropName(fileName, className, propName));
	}

	public getCachedClass (fileName: string, className: string): ICachedContent<IClassDeclaration> | null {
		return this.getFromCache<IClassDeclaration>(this.getCachedClassName(fileName, className));
	}

	public getCachedFunctionIndexer (fileName: string): ICachedContent<FunctionIndexer> | null {
		return this.getFromCache<FunctionIndexer>(this.getCachedFunctionIndexerName(fileName));
	}

	public getCachedModuleDependencies (fileName: string): ICachedContent<IImportDeclaration[]> | null {
		return this.getFromCache<IImportDeclaration[]>(this.getCachedModuleDependenciesName(fileName));
	}

	public getCachedClassIndexer (fileName: string): ICachedContent<ClassIndexer> | null {
		return this.getFromCache<ClassIndexer>(this.getCachedClassIndexerName(fileName));
	}

	public getCachedEnumIndexer (fileName: string): ICachedContent<EnumIndexer> | null {
		return this.getFromCache<EnumIndexer>(this.getCachedEnumIndexerName(fileName));
	}

	public getCachedVariableIndexer (fileName: string): ICachedContent<VariableIndexer> | null {
		return this.getFromCache<VariableIndexer>(this.getCachedVariableIndexerName(fileName));
	}

	public setCachedProp (fileName: string, content: IPropDeclaration): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedPropName(fileName, content.className, content.name), {content, version});
	}

	public setCachedVariable (fileName: string, content: IVariableAssignment): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableName(fileName, content.name), {content, version});
	}

	public setCachedEnum (fileName: string, content: IEnumDeclaration): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedEnumName(fileName, content.name), {content, version});
	}

	public setCachedClass (fileName: string, content: IClassDeclaration): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedClassName(fileName, content.name), {version, content});
	}

	public setCachedFunction (fileName: string, content: IFunctionDeclaration): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedFunctionName(fileName, content.name), {version, content});
	}

	public setCachedClassIndexer (fileName: string, content: ClassIndexer): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedClassIndexerName(fileName), {version, content});
	}

	public setCachedFunctionIndexer (fileName: string, content: FunctionIndexer): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedFunctionIndexerName(fileName), {version, content});
	}

	public setCachedModuleDependencies (fileName: string, content: IImportDeclaration[]): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedModuleDependenciesName(fileName), {version, content});
	}

	public setCachedEnumIndexer (fileName: string, content: EnumIndexer): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedEnumIndexerName(fileName), {version, content});
	}

	public setCachedVariableIndexer (fileName: string, content: VariableIndexer): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableIndexerName(fileName), {version, content});
	}

	public cachedVariableNeedsUpdate (variable: IVariableAssignment): boolean {
		const cache = this.getCachedVariable(variable.filePath, variable.name);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(variable.filePath);
		return version > cache.version;
	}

	public cachedEnumNeedsUpdate (enumDeclaration: IEnumDeclaration): boolean {
		const cache = this.getCachedEnum(enumDeclaration.filePath, enumDeclaration.name);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(enumDeclaration.filePath);
		return version > cache.version;
	}

	public cachedFunctionNeedsUpdate (functionDeclaration: IFunctionDeclaration): boolean {
		const cache = this.getCachedFunction(functionDeclaration.filePath, functionDeclaration.name);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(functionDeclaration.filePath);
		return version > cache.version;
	}

	public cachedPropNeedsUpdate (prop: IPropDeclaration): boolean {
		const cache = this.getCachedProp(prop.filePath, prop.className, prop.name);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(prop.filePath);
		return version > cache.version;
	}

	public cachedClassNeedsUpdate (classDeclaration: IClassDeclaration): boolean {
		const cache = this.getCachedClass(classDeclaration.filePath, classDeclaration.name);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(classDeclaration.filePath);
		return version > cache.version;
	}

	public cachedFunctionIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedFunctionIndexer(this.getCachedFunctionIndexerName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedModuleDependenciesNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedModuleDependencies(this.getCachedModuleDependenciesName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedClassIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedClassIndexer(this.getCachedClassIndexerName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedEnumIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedEnumIndexer(this.getCachedEnumIndexerName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedVariableIndexerNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedVariableIndexer(this.getCachedVariableIndexerName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}
}