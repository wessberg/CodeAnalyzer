import {IResolverBase} from "./i-resolver";
import {ExportDeclaration, Identifier, Node, SourceFile} from "typescript";
import {IClassService} from "../service/class/i-class-service";
import {IImportService} from "../service/import/i-import-service";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IExportService} from "../service/export/i-export-service";
import {IInterfaceDeclarationService} from "../service/interface-declaration/i-interface-declaration-service";
import {IModuleUtil} from "@wessberg/moduleutil";

/**
 * A service that can resolve nodes from Identifiers
 */
export class Resolver implements IResolverBase {
	constructor (private readonly languageService: ITypescriptLanguageService,
							 private readonly classService: IClassService,
							 private readonly interfaceDeclarationService: IInterfaceDeclarationService,
							 private readonly importService: IImportService,
							 private readonly exportService: IExportService,
							 private readonly moduleUtil: IModuleUtil) {
	}

	/**
	 * Resolves declaration that the provided Identifier references
	 * @param {Identifier} identifier
	 * @param {SourceFile} sourceFile
	 * @returns {Node}
	 */
	public resolve (identifier: Identifier|string, sourceFile: SourceFile): Node|undefined {
		const normalizedIdentifier = typeof identifier === "string" ? identifier : identifier.text;
		// Check the SourceFile for the identifier first
		const sourceFileMatch = this.locateInSourceFile(normalizedIdentifier, sourceFile);

		// If it has it, return the matched Node
		if (sourceFileMatch != null) return sourceFileMatch;

		// Otherwise, check the imports for a match
		return this.locateInSourceFileImports(normalizedIdentifier, sourceFile);
	}

	/**
	 * Locates the provided Identifier within the ImportDeclarations of the given SourceFile
	 * @param {string} identifier
	 * @param {SourceFile} sourceFile
	 * @returns {Node}
	 */
	private locateInSourceFileImports (identifier: string, sourceFile: SourceFile): Node|undefined {
		// Check if an import directly references the identifier
		const relevantImport = this.importService.getImportWithBinding(identifier, sourceFile);

		// If no relevant import appears within the file, the declaration could not be resolved
		if (relevantImport == null) {
			return undefined;
		}

		const importPath = this.importService.getPathForImportDeclaration(relevantImport);

		// If the import comes from a built-in module, do no more
		if (this.moduleUtil.builtInModules.has(importPath)) {
			return undefined;
		}

		// Get the SourceFile for the imported path
		const importedSourceFile = this.languageService.getFile({path: importPath, from: sourceFile.fileName});

		// If it couldn't resolve any file, return undefined
		if (importedSourceFile == null) return undefined;

		// Otherwise, check that SourceFile for the Identifier
		const importedSourceFileMatch = this.locateInSourceFile(
			identifier,
			importedSourceFile
		);

		// If it is matched within that SourceFile, return it
		if (importedSourceFileMatch != null) {
			return importedSourceFileMatch;
		}

		// Otherwise, check the exports of the imported SourceFile for a match
		const exportMatch = this.locateInSourceFileExports(identifier, importedSourceFile);

		// If there was a match, return that one
		if (exportMatch != null) return exportMatch;

		// Otherwise, check the Namespace exports for a match
		const namespaceExportMatch = this.locateInSourceFileNamespaceExports(identifier, importedSourceFile);

		// If there was match, return that one
		if (namespaceExportMatch != null) return namespaceExportMatch;

		// Otherwise, return undefined
		return undefined;
	}

	/**
	 * Locates an identifier within the ExportDeclarations of the provided SourceFile.
	 * Will skip those that exports from the SourceFile itself since it has already
	 * been checked.
	 * @param {string} identifier
	 * @param {SourceFile} sourceFile
	 * @returns {Node}
	 */
	private locateInSourceFileExports (identifier: string, sourceFile: SourceFile): Node|undefined {

		// Check if it has a named export referencing the identifier
		const namedExportMatch = this.exportService.getExportWithNamedExport(identifier, sourceFile);

		// If no named export exists that references the file, return undefined
		if (namedExportMatch == null) return undefined;

		// Otherwise, locate it within that ExportDeclaration
		return this.locateInSourceFileExport(identifier, namedExportMatch);
	}

	/**
	 * Locates an Identifier within the provided ExportDeclaration
	 * @param {string} identifier
	 * @param {ExportDeclaration} exportDeclaration
	 * @returns {Node}
	 */
	private locateInSourceFileExport (identifier: string, exportDeclaration: ExportDeclaration): Node|undefined {
		// Take the SourceFile of the ExportDeclaration
		const sourceFile = exportDeclaration.getSourceFile();

		// Take the SourceFile for the exported path
		const exportedSourceFile = this.languageService.getFile({path: this.exportService.getPathForExportDeclaration(exportDeclaration), from: sourceFile.fileName});

		// If it couldn't resolve any file, return undefined
		if (exportedSourceFile == null) return undefined;

		// Check if it corresponds to the path of the SourceFile - in which case it is part of the SourceFile and has already been checked
		const isExportingFromSourceFile = exportedSourceFile.fileName === sourceFile.fileName;

		// If it does, return immediately
		if (isExportingFromSourceFile) return undefined;

		// Otherwise, check that SourceFile for the Identifier
		const exportedSourceFileMatch = this.locateInSourceFile(
			identifier,
			exportedSourceFile
		);

		// If there was a match, return it
		if (exportedSourceFileMatch != null) return exportedSourceFileMatch;

		// Otherwise, recursively check that files exports recursively
		return this.locateInSourceFileExports(identifier, exportedSourceFile);
	}

	/**
	 * Locates the identifier within all of the files referenced by Namespace exports in the given SourceFile
	 * @param {string} identifier
	 * @param {SourceFile} sourceFile
	 * @returns {Node}
	 */
	private locateInSourceFileNamespaceExports (identifier: string, sourceFile: SourceFile): Node|undefined {
		// Take all of the namespace exports of the SourceFile
		const namespaceExports = this.exportService.getNamespaceExports(sourceFile);

		// Loop through all of them and return the first match, if any
		for (const namespaceExport of namespaceExports) {
			const match = this.locateInSourceFileExport(identifier, namespaceExport);
			if (match != null) return match;
		}

		return undefined;
	}

	/**
	 * Locates the definition for the given identifier within the provided SourceFile
	 * @param {string} identifier
	 * @param {SourceFile} sourceFile
	 * @returns {Node}
	 */
	private locateInSourceFile (identifier: string, sourceFile: SourceFile): Node|undefined {
		// Check if it is a class
		const classMatch = this.classService.getClassWithName(identifier, sourceFile, true);
		const interfaceMatch = this.interfaceDeclarationService.getInterfaceWithName(identifier, sourceFile, true);
		if (classMatch != null) return classMatch;
		if (interfaceMatch != null) return interfaceMatch;

		return undefined;
	}

}