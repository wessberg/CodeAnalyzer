import {ClassIndexer, EnumIndexer, FunctionIndexer, IArrowFunction, ICachedContent, IClassDeclaration, IEnumDeclaration, IExportDeclaration, IFunctionDeclaration, IIdentifier, IIdentifierMap, IImportDeclaration, IPropDeclaration, IVariableDeclaration, ResolvedIIdentifierValueMap, ResolvedSerializedIIdentifierValueMap, VariableIndexer} from "../../identifier/interface/IIdentifier";

export interface ICache {
	getCachedPropName (fileName: string, className: string, propName: string): string;
	getCachedVariableName (fileName: string, variableName: string): string;
	getCachedEnumName (fileName: string, enumName: string): string;
	getCachedClassName (fileName: string, className: string): string;
	getCachedFunctionName (fileName: string, functionName: string): string;
	getCachedClassIndexerName (fileName: string): string;
	getCachedImportDeclarationsName (fileName: string): string;
	getCachedExportDeclarationsName (fileName: string): string;
	getCachedArrowFunctionsName (fileName: string): string;
	getCachedFunctionIndexerName (fileName: string): string;
	getCachedIdentifierMapName (fileName: string): string;
	getCachedTracedIdentifierName (filePath: string, identifier: string, scope: string): string;
	getCachedResolvedIdentifierValueMapName (fileName: string): string;
	getCachedResolvedSerializedIdentifierValueMapName (fileName: string): string;
	getCachedVariableIndexerName (fileName: string): string;
	getCachedEnumIndexerName (fileName: string): string;
	getFromCache<T> (key: string): ICachedContent<T>|null;
	getCachedVariable (fileName: string, variableName: string): ICachedContent<IVariableDeclaration>|null;
	getCachedFunction (fileName: string, functionName: string): ICachedContent<IFunctionDeclaration>|null;
	getCachedEnum (fileName: string, enumName: string): ICachedContent<IEnumDeclaration>|null;
	getCachedProp (fileName: string, className: string, propName: string): ICachedContent<IPropDeclaration>|null;
	getCachedClass (fileName: string, className: string): ICachedContent<IClassDeclaration>|null;
	getCachedFunctionIndexer (fileName: string): ICachedContent<FunctionIndexer>|null;
	getCachedImportDeclarations (fileName: string): ICachedContent<IImportDeclaration[]>|null;
	getCachedExportDeclarations (fileName: string): ICachedContent<IExportDeclaration[]>|null;
	getCachedArrowFunctions (fileName: string): ICachedContent<IArrowFunction[]>|null;
	getCachedIdentifierMap (fileName: string): ICachedContent<IIdentifierMap>|null;
	getCachedTracedIdentifier (fileName: string, identifier: string, scope: string): ICachedContent<IIdentifier>|null;
	getCachedResolvedIdentifierValueMap (fileName: string): ICachedContent<ResolvedIIdentifierValueMap>|null;
	getCachedResolvedSerializedIdentifierValueMap (fileName: string): ICachedContent<ResolvedSerializedIIdentifierValueMap>|null;
	getCachedClassIndexer (fileName: string): ICachedContent<ClassIndexer>|null;
	getCachedEnumIndexer (fileName: string): ICachedContent<EnumIndexer>|null;
	getCachedVariableIndexer (fileName: string): ICachedContent<VariableIndexer>|null;
	setCachedProp (fileName: string, content: IPropDeclaration): void;
	setCachedVariable (fileName: string, content: IVariableDeclaration): void;
	setCachedEnum (fileName: string, content: IEnumDeclaration): void;
	setCachedClass (fileName: string, content: IClassDeclaration): void;
	setCachedFunction (fileName: string, content: IFunctionDeclaration): void;
	setCachedClassIndexer (fileName: string, content: ClassIndexer): void;
	setCachedFunctionIndexer (fileName: string, content: FunctionIndexer): void;
	setCachedIdentifierMap (fileName: string, content: IIdentifierMap): void;
	setCachedTracedIdentifier (fileName: string, identifier: string, scope: string, content: IIdentifier): void;
	setCachedResolvedIdentifierValueMap (fileName: string, content: ResolvedIIdentifierValueMap): void;
	setCachedResolvedSerializedIdentifierValueMap (fileName: string, content: ResolvedSerializedIIdentifierValueMap): void;
	setCachedImportDeclarations (fileName: string, content: IImportDeclaration[]): void;
	setCachedExportDeclarations (fileName: string, content: IExportDeclaration[]): void;
	setCachedArrowFunctions (fileName: string, content: IArrowFunction[]): void;
	setCachedEnumIndexer (fileName: string, content: EnumIndexer): void;
	setCachedVariableIndexer (fileName: string, content: VariableIndexer): void;
	cachedVariableNeedsUpdate (variable: IVariableDeclaration): boolean;
	cachedEnumNeedsUpdate (enumDeclaration: IEnumDeclaration): boolean;
	cachedFunctionNeedsUpdate (functionDeclaration: IFunctionDeclaration): boolean;
	cachedPropNeedsUpdate (prop: IPropDeclaration): boolean;
	cachedClassNeedsUpdate (classDeclaration: IClassDeclaration): boolean;
	cachedFunctionIndexerNeedsUpdate (filePath: string): boolean;
	cachedImportDeclarationsNeedsUpdate (filePath: string): boolean;
	cachedExportDeclarationsNeedsUpdate (filePath: string): boolean;
	cachedArrowFunctionsNeedsUpdate (filePath: string): boolean;
	cachedIdentifierMapNeedsUpdate (filePath: string): boolean;
	cachedTracedIdentifierNeedsUpdate (filePath: string, identifier: string, scope: string): boolean;
	cachedResolvedIdentifierValueMapNeedsUpdate (filePath: string): boolean;
	cachedResolvedSerializedIdentifierValueMapNeedsUpdate (filePath: string): boolean;
	cachedClassIndexerNeedsUpdate (filePath: string): boolean;
	cachedEnumIndexerNeedsUpdate (filePath: string): boolean;
	cachedVariableIndexerNeedsUpdate (filePath: string): boolean;
}