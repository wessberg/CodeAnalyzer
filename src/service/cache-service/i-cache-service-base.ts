import {FormattedFunction, IFormattedCallExpression, IFormattedClass, IFormattedIdentifier, IFormattedInterfaceType} from "@wessberg/type";

export interface ICacheServiceBase {
	cachedClassesNeedsUpdate (file: string): boolean;
	cachedCallExpressionsNeedsUpdate (file: string): boolean;
	cachedFunctionsNeedsUpdate (file: string): boolean;
	cachedIdentifiersNeedsUpdate (file: string): boolean;
	cachedImportsNeedsUpdate (file: string): boolean;
	cachedInterfacesNeedsUpdate (file: string): boolean;

	setCachedClassesForFile (file: string, classes: IFormattedClass[]): IFormattedClass[];
	setCachedCallExpressionsForFile (file: string, callExpressions: IFormattedCallExpression[]): IFormattedCallExpression[];
	setCachedFunctionsForFile (file: string, functions: FormattedFunction[]): FormattedFunction[];
	setCachedIdentifiersForFile (file: string, identifiers: IFormattedIdentifier[]): IFormattedIdentifier[];
	setCachedImportsForFile (file: string, imports: string[]): string[];
	setCachedInterfacesForFile (file: string, interfaces: IFormattedInterfaceType[]): IFormattedInterfaceType[];

	getCachedClassesForFile (file: string): IFormattedClass[]|undefined;
	getCachedCallExpressionsForFile (file: string): IFormattedCallExpression[]|undefined;
	getCachedFunctionsForFile (file: string): FormattedFunction[]|undefined;
	getCachedIdentifiersForFile (file: string): IFormattedIdentifier[]|undefined;
	getCachedImportsForFile (file: string): string[]|undefined;
	getCachedInterfacesForFile (file: string): IFormattedInterfaceType[]|undefined;
}