import {FormattedFunction, IFormattedCallExpression, IFormattedClass, IFormattedExport, IFormattedIdentifier, IFormattedImport, IFormattedInterfaceType} from "@wessberg/type";

export interface ICacheServiceBase {
	cachedClassesNeedsUpdate (file: string): boolean;
	cachedCallExpressionsNeedsUpdate (file: string): boolean;
	cachedFunctionsNeedsUpdate (file: string): boolean;
	cachedIdentifiersNeedsUpdate (file: string): boolean;
	cachedImportsNeedsUpdate (file: string): boolean;
	cachedExportsNeedsUpdate (file: string): boolean;
	cachedInterfacesNeedsUpdate (file: string): boolean;

	setCachedClassesForFile (file: string, classes: IFormattedClass[]): IFormattedClass[];
	setCachedCallExpressionsForFile (file: string, callExpressions: IFormattedCallExpression[]): IFormattedCallExpression[];
	setCachedFunctionsForFile (file: string, functions: FormattedFunction[]): FormattedFunction[];
	setCachedIdentifiersForFile (file: string, identifiers: IFormattedIdentifier[]): IFormattedIdentifier[];
	setCachedImportsForFile (file: string, imports: IFormattedImport[]): IFormattedImport[];
	setCachedExportsForFile (file: string, exports: IFormattedExport[]): IFormattedExport[];
	setCachedInterfacesForFile (file: string, interfaces: IFormattedInterfaceType[]): IFormattedInterfaceType[];

	getCachedClassesForFile (file: string): IFormattedClass[]|undefined;
	getCachedCallExpressionsForFile (file: string): IFormattedCallExpression[]|undefined;
	getCachedFunctionsForFile (file: string): FormattedFunction[]|undefined;
	getCachedIdentifiersForFile (file: string): IFormattedIdentifier[]|undefined;
	getCachedImportsForFile (file: string): IFormattedImport[]|undefined;
	getCachedExportsForFile (file: string): IFormattedExport[]|undefined;
	getCachedInterfacesForFile (file: string): IFormattedInterfaceType[]|undefined;
}