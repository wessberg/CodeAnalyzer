import {IIdentifierResolver} from "./i-identifier-resolver";
import {FormattedExpression, FormattedFunction, IFormattedClass, IFormattedExport, IFormattedImport, isFormattedNormalFunction, isFormattedPropertyStaticName} from "@wessberg/type";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ClassServiceGetter} from "../../service/class-service/class-service-getter";
import {FunctionServiceGetter} from "../../service/function-service/function-service-getter";
import {ImportServiceGetter} from "../../service/import-service/import-service-getter";
import {ExportServiceGetter} from "../../service/export-service/export-service-getter";

/**
 * A class that can resolve any identifier
 */
export class IdentifierResolver implements IIdentifierResolver {
	constructor (private languageService: ITypescriptLanguageService,
							 private importService: ImportServiceGetter,
							 private exportService: ExportServiceGetter,
							 private classService: ClassServiceGetter,
							 private functionService: FunctionServiceGetter) {
	}

	/**
	 * Resolves the given identifier
	 * @param {IFormattedIdentifier} identifier
	 * @returns {FormattedExpression}
	 */
	public resolve (identifier: FormattedExpression): FormattedExpression|undefined {
		return this.findDefinitionForIdentifier(identifier);
	}

	/**
	 * Finds the FormattedExpression that matches the provided identifier.
	 * Checks the host file before attempting to locate it within the imports of the module
	 * @param {FormattedExpression} identifier
	 * @returns {FormattedExpression}
	 */
	private findDefinitionForIdentifier (identifier: FormattedExpression): FormattedExpression|undefined {
		const importService = this.importService();

		// Check the file containing the identifier first
		const hostMatch = this.findIdentifier(identifier, identifier.file);
		if (hostMatch != null) return hostMatch;

		// Check the imports that directly references the identifier
		const imports = importService.getImportsForFile(identifier.file);

		// Only take those that references the identifier directly
		const filtered = imports.filter(importPath => this.qualifyModuleBindings(importPath, identifier));

		for (const importPath of filtered) {
			const match = this.findInImportPath(importPath, identifier);
			if (match != null) return match;
		}
		return undefined;
	}

	/**
	 * Finds the FormattedExpression that matches the identifier, if possible
	 * @param {FormattedExpression} identifier
	 * @param {string} file
	 * @returns {FormattedExpression}
	 */
	private findIdentifier (identifier: FormattedExpression, file: string): FormattedExpression|undefined {
		// Check if it is a class
		const classMatch = this.findMatchingClass(identifier, this.classService().getClassesForFile(file));
		if (classMatch != null) return classMatch;

		// Check if it is a function
		const functionMatch = this.findMatchingFunction(identifier, this.functionService().getFunctionsForFile(file));
		if (functionMatch != null) return functionMatch;

		return undefined;
	}

	/**
	 * Finds a class that matches the given identifier
	 * @param {FormattedExpression} identifier
	 * @param {IFormattedClass[]} classes
	 * @returns {IFormattedClass}
	 */
	private findMatchingClass (identifier: FormattedExpression, classes: IFormattedClass[]): IFormattedClass|undefined {
		return classes.find(formatted => formatted.name != null && formatted.name.name === identifier.toString());
	}

	/**
	 * Finds a function that matches the given identifier
	 * @param {FormattedExpression} identifier
	 * @param {FormattedFunction[]} functions
	 * @returns {FormattedFunction}
	 */
	private findMatchingFunction (identifier: FormattedExpression, functions: FormattedFunction[]): FormattedFunction|undefined {
		return functions.find(formatted => isFormattedNormalFunction(formatted) && formatted.name != null && isFormattedPropertyStaticName(formatted.name) && formatted.name.name === identifier.toString());
	}

	/**
	 * Takes all relevant import paths from an import. This will usually just be the import itself,
	 * but it may actually point to a file that re-exports an identifier from another file. That file
	 * should also be included
	 * @param {IFormattedImport} importPath
	 * @param {string} identifier
	 */
	private findInImportPath (importPath: IFormattedImport, identifier: FormattedExpression): FormattedExpression|undefined {
		// Check if the identifier is located within the file itself
		const {normalizedPath} = this.languageService.getAddPath(importPath.path, importPath.file);
		const match = this.findIdentifier(identifier, normalizedPath);
		if (match != null) return match;

		// Check its exports. It may re-export something from another file.
		return this.findInExportsForFile(normalizedPath, identifier);
	}

	/**
	 * Takes all relevant exports from a file
	 * @param {string} file
	 * @param {string} identifier
	 */
	private findInExportsForFile (file: string, identifier: FormattedExpression): FormattedExpression|undefined {
		const exportService = this.exportService();

		// Check its exports. It may re-export something from another file.
		const exports = exportService.getExportsForFile(file);
		for (const exportPath of exports) {
			const match = this.findInExportPath(exportPath, file, identifier);
			if (match != null) return match;
		}
		return undefined;
	}

	/**
	 * Takes all relevant export paths  from the provided IFormattedExport.
	 * It will only be relevant if it exports the provided identifier AND it exports it from another
	 * file than the host file (because it is already covered by the import)
	 * @param {IFormattedExport} exportPath
	 * @param {string} hostNormalizedPath
	 * @param {string} identifier
	 * @returns {FormattedExpression?}
	 */
	private findInExportPath (exportPath: IFormattedExport, hostNormalizedPath: string, identifier: FormattedExpression): FormattedExpression|undefined {

		// If the export has no path, it exports from the host module.
		// We don't need it since that will already be covered by the import of the host module
		if (exportPath.path == null) return;

		const hasRelevantExportBinding = this.qualifyModuleBindings(exportPath, identifier);

		// Don't use it if it doesn't export the desired identifier
		if (!hasRelevantExportBinding) return;

		// Check if the identifier is located within the file itself
		const {normalizedPath} = this.languageService.getAddPath(exportPath.path, exportPath.file);

		// Check if the export is exporting from the same path as the host module
		const isSamePath = normalizedPath === hostNormalizedPath;

		// Return immediately if it doesn't export from the same path as the host module (which we have checked already)
		if (isSamePath) return;

		const match = this.findIdentifier(identifier, normalizedPath);
		if (match != null) return match;

		// Do this recursively as it may re-export from another module that re-exports (and so on)
		return this.findInExportsForFile(normalizedPath, identifier);
	}

	/**
	 * Qualifies module bindings. They must have at least one that exactly matches the one provided as the second argument
	 * @param {IFormattedImport | IFormattedExport} importPath
	 * @param {FormattedExpression} identifier
	 * @returns {boolean}
	 */
	private qualifyModuleBindings (importPath: IFormattedImport|IFormattedExport, identifier: FormattedExpression): boolean {
		return importPath.bindings.some(binding => binding.name === identifier.toString());
	}
}