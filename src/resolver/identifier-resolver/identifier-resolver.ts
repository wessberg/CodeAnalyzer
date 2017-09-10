import {IIdentifierResolver} from "./i-identifier-resolver";
import {FormattedExpression, IFormattedExport, IFormattedImport} from "@wessberg/type";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {AstMapperGetter} from "../../mapper/ast-mapper/ast-mapper-getter";
import {DefinitionInfo, ScriptElementKind} from "typescript";
import {ClassServiceGetter} from "../../service/class-service/class-service-getter";
import {FunctionServiceGetter} from "../../service/function-service/function-service-getter";
import {ImportServiceGetter} from "../../service/import-service/import-service-getter";
import {ExportServiceGetter} from "../../service/export-service/export-service-getter";

/**
 * A class that can resolve any identifier
 */
export class IdentifierResolver implements IIdentifierResolver {
	constructor (private astMapper: AstMapperGetter,
							 private languageService: ITypescriptLanguageService,
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
	public resolve (identifier: FormattedExpression): FormattedExpression|null {
		// Fetch all imported paths and add them to the Language Service first
		const imports = this.addDependencies(identifier);

		// Get the definition
		const definition = this.getDefinitionForIdentifier(identifier);
		if (definition == null) return null;

		// Check the dependencies first
		this.checkDependencies(imports, definition);

		// Get the matching formatted expression
		return this.astMapper().getFormattedExpressionForFileAtPosition(definition.fileName, definition.textSpan.start);
	}

	/**
	 * Checks all dependencies for relevant expressions.
	 * For example, if Typescript informs that an identifier is a class
	 * we want to make sure that the class has been parsed by the CodeAnalyzer
	 * so that it can be properly resolved
	 * @param {string[]} paths
	 * @param {DefinitionInfo} definition
	 */
	private checkDependencies (paths: string[], definition: DefinitionInfo): void {

		new Set([...paths, definition.fileName]).forEach(path => {
			switch (definition.kind) {

				case ScriptElementKind.classElement:
					// Check the file for classes unless it is already being checked
					this.classService().getClassesForFile(path);
					break;

				case ScriptElementKind.functionElement:
					// Check the file for functions unless it is already being checked
					this.functionService().getFunctionsForFile(path);
					break;
			}
		});
	}

	/**
	 * Adds all the dependencies of the file containing the provided identifier to the language service
	 * @param {FormattedExpression} identifier
	 * @returns {string[]}
	 */
	private addDependencies (identifier: FormattedExpression): string[] {
		// Get all import paths
		const importService = this.importService();
		const imports = importService.getImportsForFile(identifier.file);
		const stringified = identifier.toString();
		const paths: Set<string> = new Set();

		imports
		// Only take those that references the identifier directly
			.filter(importPath => this.qualifyModuleBindings(importPath, stringified))
			// Take all of the relevant imports and exports
			.forEach(importPath => this.takeRelevantImportPaths(importPath, stringified, paths));

		// Return the normalized paths.
		return [...paths];
	}

	/**
	 * Takes all relevant import paths from an import. This will usually just be the import itself,
	 * but it may actually point to a file that re-exports an identifier from another file. That file
	 * should also be included
	 * @param {IFormattedImport} importPath
	 * @param {string} identifier
	 * @param {Set<string>} [existingPaths]
	 */
	private takeRelevantImportPaths (importPath: IFormattedImport, identifier: string, existingPaths: Set<string> = new Set()): void {

		const languageService = this.languageService;

		// Take the addPath
		const addPath = this.languageService.getAddPath(importPath.path, importPath.file);

		// Stop immediately if the path has already been added
		if (existingPaths.has(addPath.normalizedPath)) return;

		// Otherwise, convert it into pathInfo
		const pathInfo = languageService.getPathInfo(addPath);

		// Only add the file if it needs an update
		if (pathInfo.needsUpdate) {
			// Add it to the language service immediately so future 'needsUpdate' values for duplicates will return false
			this.languageService.addFile(pathInfo);
			existingPaths.add(pathInfo.normalizedPath);

			// Check its exports. It may re-export something from another file.
			this.takeRelevantExportsForFile(pathInfo.normalizedPath, identifier, existingPaths);
		}
	}

	/**
	 * Takes all relevant exports from a file
	 * @param {string} file
	 * @param {string} identifier
	 * @param {Set<string>} [existingPaths]
	 */
	private takeRelevantExportsForFile (file: string, identifier: string, existingPaths: Set<string> = new Set()): void {
		const exportService = this.exportService();

		// Check its exports. It may re-export something from another file.
		const exports = exportService.getExportsForFile(file);
		exports.forEach(exportPath => {
			this.takeRelevantExportPaths(exportPath, file, identifier, existingPaths);
		});
	}

	/**
	 * Takes all relevant export paths  from the provided IFormattedExport.
	 * It will only be relevant if it exports the provided identifier AND it exports it from another
	 * file than the host file (because it is already covered by the import)
	 * @param {IFormattedExport} exportPath
	 * @param {string} hostNormalizedPath
	 * @param {string} identifier
	 * @param {Set<string>} [existingPaths]
	 */
	private takeRelevantExportPaths (exportPath: IFormattedExport, hostNormalizedPath: string, identifier: string, existingPaths: Set<string> = new Set()): void {
		const languageService = this.languageService;

		// If the export has no path, it exports from the host module.
		// We don't need it since that will already be covered by the import of the host module
		if (exportPath.path == null) return;

		const hasRelevantExportBinding = this.qualifyModuleBindings(exportPath, identifier);

		// Don't use it if it doesn't export the desired identifier
		if (!hasRelevantExportBinding) return;

		// Take the addPath
		const addPath = this.languageService.getAddPath(exportPath.path, exportPath.file);

		// Stop immediately if the path has already been added
		if (existingPaths.has(addPath.normalizedPath)) return;

		// Format the path info
		const pathInfo = languageService.getPathInfo(addPath);

		// Check if the export is exporting from the same path as the host module
		const isSamePath = pathInfo.normalizedPath === hostNormalizedPath;

		// Only add it if it doesn't export from the same path as the host module and the reference path needs an update
		if (!isSamePath && pathInfo.needsUpdate) {
			// Add it to the language service immediately so future 'needsUpdate' values for duplicates will return false
			this.languageService.addFile(pathInfo);
			existingPaths.add(pathInfo.normalizedPath);
			// Do this recursively as it may re-export from another module that re-exports (and so on)
			this.takeRelevantExportsForFile(pathInfo.normalizedPath, identifier, existingPaths);
		}
	}

	/**
	 * Qualifies module bindings. They must have at least one that exactly matches the one provided as the second argument
	 * @param {IFormattedImport | IFormattedExport} importPath
	 * @param {string} bindingMustMatch
	 * @returns {boolean}
	 */
	private qualifyModuleBindings (importPath: IFormattedImport|IFormattedExport, bindingMustMatch: string): boolean {
		return importPath.bindings.some(binding => binding.name === bindingMustMatch);
	}

	/**
	 * Gets the definition for a formatted expression
	 * @param {FormattedExpression} identifier
	 * @returns {DefinitionInfo}
	 */
	private getDefinitionForIdentifier (identifier: FormattedExpression): DefinitionInfo|null {
		const rawDefinitions = this.languageService.getDefinitionAtPosition(identifier.file, identifier.startsAt);
		if (rawDefinitions == null) return null;

		// Return the first definition
		return rawDefinitions[0];
	}

}