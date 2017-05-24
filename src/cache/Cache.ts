import {ClassIndexer, EnumIndexer, FunctionIndexer, ICachedContent, IClassDeclaration, ICodeAnalyzer, IEnumDeclaration, IExportDeclaration, IFunctionDeclaration, IIdentifierMap, IImportDeclaration, IParameter, IPropDeclaration, IVariableAssignment, ResolvedIIdentifierValueMap, ResolvedSerializedIIdentifierValueMap, VariableIndexer} from "../service/interface/ICodeAnalyzer";
import {ICache} from "./interface/ICache";
import {SerializedVersions} from "../serializer/interface/IIdentifierSerializer";

export class Cache implements ICache {
	private cache: Map<string, ICachedContent<{}>> = new Map();

	constructor (private languageService: ICodeAnalyzer) {
	}

	public getCachedSerializedVariableName (fileName: string, position: number, variableName: string): string {
		return `serializedVariable.${fileName}.${position}.${variableName}`;
	}

	public getCachedSerializedParameterName (fileName: string, position: number, parameterName: (string|undefined)[]): string {
		return `serializedParameter.${fileName}.${position}.${parameterName.join(".")}`;
	}

	public getCachedSerializedClassName (fileName: string, position: number, className: string): string {
		return `serializedClass.${fileName}.${position}.${className}`;
	}

	public getCachedSerializedEnumName (fileName: string, position: number, enumName: string): string {
		return `serializedEnum.${fileName}.${position}.${enumName}`;
	}

	public getCachedSerializedFunctionName (fileName: string, position: number, functionName: string): string {
		return `serializedFunction.${fileName}.${position}.${functionName}`;
	}

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

	public getCachedSerializedVariable (variable: IVariableAssignment): ICachedContent<SerializedVersions>|null {
		return this.getFromCache<SerializedVersions>(this.getCachedSerializedVariableName(variable.filePath, variable.startsAt, variable.name));
	}

	public getCachedSerializedParameter (parameter: IParameter): ICachedContent<SerializedVersions>|null {
		return this.getFromCache<SerializedVersions>(this.getCachedSerializedParameterName(parameter.filePath, parameter.startsAt, parameter.name));
	}

	public getCachedSerializedClass (classDeclaration: IClassDeclaration): ICachedContent<SerializedVersions>|null {
		return this.getFromCache<SerializedVersions>(this.getCachedSerializedClassName(classDeclaration.filePath, classDeclaration.startsAt, classDeclaration.name));
	}

	public getCachedSerializedEnum (enumDeclaration: IEnumDeclaration): ICachedContent<SerializedVersions>|null {
		return this.getFromCache<SerializedVersions>(this.getCachedSerializedEnumName(enumDeclaration.filePath, enumDeclaration.startsAt, enumDeclaration.name));
	}

	public getCachedSerializedFunction (functionDeclaration: IFunctionDeclaration): ICachedContent<SerializedVersions>|null {
		return this.getFromCache<SerializedVersions>(this.getCachedSerializedFunctionName(functionDeclaration.filePath, functionDeclaration.startsAt, functionDeclaration.name));
	}

	public getCachedVariable (fileName: string, variableName: string): ICachedContent<IVariableAssignment>|null {
		return this.getFromCache<IVariableAssignment>(this.getCachedVariableName(fileName, variableName));
	}

	public getCachedFunction (fileName: string, functionName: string): ICachedContent<IFunctionDeclaration>|null {
		return this.getFromCache<IFunctionDeclaration>(this.getCachedFunctionName(fileName, functionName));
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

	public setCachedSerializedVariable (variable: IVariableAssignment, content: SerializedVersions): void {
		const version = this.languageService.getFileVersion(variable.filePath);
		this.cache.set(this.getCachedSerializedVariableName(variable.filePath, variable.startsAt, variable.name), {content, version});
	}

	public setCachedSerializedParameter (parameter: IParameter, content: SerializedVersions): void {
		const version = this.languageService.getFileVersion(parameter.filePath);
		this.cache.set(this.getCachedSerializedParameterName(parameter.filePath, parameter.startsAt, parameter.name), {content, version});
	}

	public setCachedSerializedClass (classDeclaration: IClassDeclaration, content: SerializedVersions): void {
		const version = this.languageService.getFileVersion(classDeclaration.filePath);
		this.cache.set(this.getCachedSerializedClassName(classDeclaration.filePath, classDeclaration.startsAt, classDeclaration.name), {content, version});
	}

	public setCachedSerializedEnum (enumDeclaration: IEnumDeclaration, content: SerializedVersions): void {
		const version = this.languageService.getFileVersion(enumDeclaration.filePath);
		this.cache.set(this.getCachedSerializedEnumName(enumDeclaration.filePath, enumDeclaration.startsAt, enumDeclaration.name), {content, version});
	}

	public setCachedSerializedFunction (functionDeclaration: IFunctionDeclaration, content: SerializedVersions): void {
		const version = this.languageService.getFileVersion(functionDeclaration.filePath);
		this.cache.set(this.getCachedSerializedFunctionName(functionDeclaration.filePath, functionDeclaration.startsAt, functionDeclaration.name), {content, version});
	}

	public setCachedVariable (fileName: string, content: IVariableAssignment): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableName(fileName, content.name), {content, version});
	}

	public setCachedProp (fileName: string, content: IPropDeclaration): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedPropName(fileName, content.className, content.name), {content, version});
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

	public setCachedIdentifierMap (fileName: string, content: IIdentifierMap): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedIdentifierMapName(fileName), {version, content});
	}

	public setCachedResolvedIdentifierValueMap (fileName: string, content: ResolvedIIdentifierValueMap): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedResolvedIdentifierValueMapName(fileName), {version, content});
	}

	public setCachedResolvedSerializedIdentifierValueMap (fileName: string, content: ResolvedSerializedIIdentifierValueMap): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedResolvedSerializedIdentifierValueMapName(fileName), {version, content});
	}

	public setCachedFunctionIndexer (fileName: string, content: FunctionIndexer): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedFunctionIndexerName(fileName), {version, content});
	}

	public setCachedImportDeclarations (fileName: string, content: IImportDeclaration[]): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedImportDeclarationsName(fileName), {version, content});
	}

	public setCachedExportDeclarations (fileName: string, content: IExportDeclaration[]): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedExportDeclarationsName(fileName), {version, content});
	}

	public setCachedEnumIndexer (fileName: string, content: EnumIndexer): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedEnumIndexerName(fileName), {version, content});
	}

	public setCachedVariableIndexer (fileName: string, content: VariableIndexer): void {
		const version = this.languageService.getFileVersion(fileName);
		this.cache.set(this.getCachedVariableIndexerName(fileName), {version, content});
	}

	public cachedSerializedVariableNeedsUpdate (variable: IVariableAssignment): boolean {
		const cache = this.getCachedSerializedVariable(variable);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(variable.filePath);
		return version > cache.version;
	}

	public cachedSerializedParameterNeedsUpdate (parameter: IParameter): boolean {
		const cache = this.getCachedSerializedParameter(parameter);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(parameter.filePath);
		return version > cache.version;
	}

	public cachedSerializedClassNeedsUpdate (classDeclaration: IClassDeclaration): boolean {
		const cache = this.getCachedSerializedClass(classDeclaration);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(classDeclaration.filePath);
		return version > cache.version;
	}

	public cachedSerializedEnumNeedsUpdate (enumDeclaration: IEnumDeclaration): boolean {
		const cache = this.getCachedSerializedEnum(enumDeclaration);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(enumDeclaration.filePath);
		return version > cache.version;
	}

	public cachedSerializedFunctionNeedsUpdate (functionDeclaration: IFunctionDeclaration): boolean {
		const cache = this.getCachedSerializedFunction(functionDeclaration);
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(functionDeclaration.filePath);
		return version > cache.version;
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

	public cachedIdentifierMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedIdentifierMap(this.getCachedIdentifierMapName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedResolvedIdentifierValueMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedResolvedIdentifierValueMap(this.getCachedResolvedIdentifierValueMapName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedResolvedSerializedIdentifierValueMapNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedResolvedIdentifierValueMap(this.getCachedResolvedSerializedIdentifierValueMapName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedImportDeclarationsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedImportDeclarations(this.getCachedImportDeclarationsName(filePath));
		if (cache == null) return true;

		const version = this.languageService.getFileVersion(filePath);
		return version > cache.version;
	}

	public cachedExportDeclarationsNeedsUpdate (filePath: string): boolean {
		const cache = this.getCachedExportDeclarations(this.getCachedExportDeclarationsName(filePath));
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