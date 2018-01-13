import {createNodeArray, Identifier, ImportDeclaration, isNamedImports, isNamespaceImport, isStringLiteral, NamedImportBindings, NamedImports, NamespaceImport, SourceFile, SyntaxKind} from "typescript";
import {IImportService} from "./i-import-service";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {INamedImportsService} from "../named-imports/i-named-imports-service";
import {INamespaceImportService} from "../namespace-import/i-namespace-import-service";
import {IUpdater} from "../../updater/i-updater-getter";
import {INodeToCtorMapperBase} from "../../node-to-ctor-mapper/i-node-to-ctor-mapper";
import {NodeService} from "../node/node-service";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {IStringUtil} from "@wessberg/stringutil";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {INamedImportExportCtor} from "../../light-ast/ctor/named-import-export/i-named-import-export-ctor";
import {IImportCtor} from "../../light-ast/ctor/import/i-import-ctor";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IPlacement} from "../../placement/i-placement";
import {IModuleUtil} from "@wessberg/moduleutil";
import {join} from "path";
import {IPathUtil} from "@wessberg/pathutil";

/**
 * A class that helps with working with ImportDeclarations through the Typescript ASt
 */
export class ImportService extends NodeService<ImportDeclaration> implements IImportService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.ImportDeclaration];

	constructor (private namedImportsService: INamedImportsService,
							 private namespaceImportService: INamespaceImportService,
							 private nodeToCtorMapper: INodeToCtorMapperBase,
							 private moduleUtil: IModuleUtil,
							 private formatter: IFormatter,
							 private printer: IPrinter,
							 private pathUtil: IPathUtil,
							 private stringUtil: IStringUtil,
							 updater: IUpdater,
							 joiner: IJoiner,
							 astUtil: ITypescriptASTUtil,
							 decoratorService: IDecoratorService,
							 languageService: ITypescriptLanguageService,
							 remover: IRemover) {
		super(decoratorService, languageService, joiner, updater, remover, astUtil);
	}

	/**
	 * Gets the import path of an ImportDeclaration
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {string}
	 */
	public getPathForImportDeclaration (importDeclaration: ImportDeclaration): string {
		const literal = this.printer.print(importDeclaration.moduleSpecifier);
		// Make sure to return the path unquoted
		return this.stringUtil.isQuoted(literal) ? literal.slice(1, literal.length - 1) : literal;
	}

	/**
	 * Gets all ImportDeclarations that refers to the provided path in the provided sourceFile
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {NodeArray<ImportDeclaration>}
	 */
	public getImportsForPath (path: string, sourceFile: SourceFile): ImportDeclaration[] {
		const imports = this.getAll(sourceFile);
		return imports.filter(importDeclaration => {
			if (!isStringLiteral(importDeclaration.moduleSpecifier)) return false;
			const text = importDeclaration.moduleSpecifier.text;
			if (text === path) return true;
			try {
				const resolvedModule = this.moduleUtil.resolvePath(text, join(sourceFile.fileName, "../"));
				if (resolvedModule === path) return true;
				return path === resolvedModule || this.pathUtil.clearExtension(path) === this.pathUtil.clearExtension(resolvedModule);
			} catch {
				return false;
			}
		});
	}

	/**
	 * Gets the ImportDeclarations that refers to the provided path and
	 * has a named import matching the provided one in the provided SourceFile.
	 * If no path is provided, it will look across all ImportDeclarations
	 * @param namedImport
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {ImportDeclaration?}
	 */
	public getImportWithNamedImport (namedImport: INamedImportExportCtor, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined {
		const imports = path == null ? [...this.getAll(sourceFile)] : this.getImportsForPath(path, sourceFile);
		return imports.find(importDeclaration => this.hasNamedImport(namedImport, importDeclaration));
	}

	/**
	 * Gets the ImportDeclarations that refers to the provided path and has a namespace import with the provided
	 * namespace name. If no path is provided, it will look across all ImportDeclarations
	 * @param {string} namespace
	 * @param {SourceFile} sourceFile
	 * @param {string} path
	 * @returns {ImportDeclaration?}
	 */
	public getImportWithNamespace (namespace: string, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined {
		const imports = path == null ? [...this.getAll(sourceFile)] : this.getImportsForPath(path, sourceFile);
		return imports.find(importDeclaration => this.hasNamespaceImportWithName(namespace, importDeclaration));
	}

	/**
	 * Gets the ImportDeclarations that refers to the provided path and has a default name matching the provided one.
	 * If no path is provided, it will look across all ImportDeclarations
	 * @param {string} name
	 * @param {SourceFile} sourceFile
	 * @param {string} path
	 * @returns {ImportDeclaration?}
	 */
	public getImportWithName (name: string, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined {
		const imports = path == null ? [...this.getAll(sourceFile)] : this.getImportsForPath(path, sourceFile);
		return imports.find(importDeclaration => this.hasSpecificName(name, importDeclaration));
	}

	/**
	 * Gets the ImportDeclarations that refers to the provided path and has any binding such as a named import, default
	 * name or a namespace matching the provided one.
	 * If no path is provided, it will look across all ImportDeclarations
	 * @param {INamedImportExportCtor | string} binding
	 * @param {SourceFile} sourceFile
	 * @param {string} path
	 * @returns {ImportDeclaration?}
	 */
	public getImportWithBinding (binding: string, sourceFile: SourceFile, path?: string): ImportDeclaration|undefined {
		const imports = path == null ? [...this.getAll(sourceFile)] : this.getImportsForPath(path, sourceFile);

		// First, check if a named binding is matched anywhere
		const namedBindingMatch = imports.find(importDeclaration => this.hasNamedImport(binding, importDeclaration));
		if (namedBindingMatch != null) return namedBindingMatch;

		// Otherwise, check first if the namespace is matched
		const namespaceMatch = imports.find(importDeclaration => this.hasNamespaceImportWithName(binding, importDeclaration));
		if (namespaceMatch != null) return namespaceMatch;

		// Otherwise, check if a matching default name is matched
		return imports.find(importDeclaration => this.hasSpecificName(binding, importDeclaration));
	}

	/**
	 * Returns the default binding name for an ImportDeclaration (such as 'import name from "something"' where the identifier for 'name' would be returned)
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {Identifier}
	 */
	public getNameForImportDeclaration (importDeclaration: ImportDeclaration): Identifier|undefined {
		if (importDeclaration.importClause == null) return;
		return importDeclaration.importClause == null ? undefined : importDeclaration.importClause.name;
	}

	/**
	 * Returns true if the provided ImportDeclaration has any named imports (e.g. at least has '{}' brackets)
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasNamedImports (importDeclaration: ImportDeclaration): boolean {
		return this.getNamedImportsForImportDeclaration(importDeclaration) != null;
	}

	/**
	 * Returns true if the provided ImportDeclaration already imports the provided named import.
	 * A named import is anything in between "{" and "}" in an import.
	 * @param {INamedImportExportCtor|string} namedImport
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasNamedImport (namedImport: string|INamedImportExportCtor, importDeclaration: ImportDeclaration): boolean {
		const namedImports = this.getNamedImportsForImportDeclaration(importDeclaration);
		return namedImports != null && this.namedImportsService.hasImportWithName(namedImport, namedImports);
	}

	/**
	 * Returns true if the provided ImportDeclaration has a namespace import
	 * @param {ts.ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasNamespaceImport (importDeclaration: ImportDeclaration): boolean {
		return this.getNamespaceImportForImportDeclaration(importDeclaration) != null;
	}

	/**
	 * Returns true if the provided ImportDeclaration has a namespace import with the provided name
	 * @param {string} namespaceName
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasNamespaceImportWithName (namespaceName: string, importDeclaration: ImportDeclaration): boolean {
		const namespace = this.getNamespaceImportForImportDeclaration(importDeclaration);
		return namespace != null && this.namespaceImportService.getNameOfNamespace(namespace) === namespaceName;
	}

	/**
	 * Returns true if the import declaration has a name (e.g. a default import)
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasName (importDeclaration: ImportDeclaration): boolean {
		return this.getNameForImportDeclaration(importDeclaration) != null;
	}

	/**
	 * Returns true if the import declaration has a name (e.g. a default import)
	 * and it is identical with the provided one
	 * @param {string} name
	 * @param {ts.ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasSpecificName (name: string, importDeclaration: ImportDeclaration): boolean {
		const importName = this.getNameForImportDeclaration(importDeclaration);
		return importName != null && importName.text === name;
	}

	/**
	 * Takes all NamedImports for an ImportDeclaration.
	 * This is all named imports that isn't namespace imports (such as 'import {A, B, C} from "something')
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {NamedImports?}
	 */
	public getNamedImportsForImportDeclaration (importDeclaration: ImportDeclaration): NamedImports|undefined {
		// Return undefined if
		// 1. The import has no importClause (in which case it just imports the path)
		// 2. if it doesn't have any named bindings
		// 3. if the named bindings isn't named imports (in which case it is a namespace import)
		if (
			importDeclaration.importClause == null ||
			importDeclaration.importClause.namedBindings == null ||
			!isNamedImports(importDeclaration.importClause.namedBindings)
		) return;

		return importDeclaration.importClause.namedBindings;
	}

	/**
	 * Takes the namespace import for an ImportDeclaration, if it has any
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {NamespaceImport}
	 */
	public getNamespaceImportForImportDeclaration (importDeclaration: ImportDeclaration): NamespaceImport|undefined {
		// Return undefined if
		// 1. The import has no importClause (in which case it just imports the path)
		// 2. if it doesn't have any named bindings
		// 3. if the named bindings isn't a namespace import (in which case it is named bindings such as 'import {A, B, C} from "something"')
		if (
			importDeclaration.importClause == null ||
			importDeclaration.importClause.namedBindings == null ||
			!isNamespaceImport(importDeclaration.importClause.namedBindings)
		) return;

		return importDeclaration.importClause.namedBindings;
	}

	/**
	 * Takes the named imports or the namespace import for an ImportDeclaration, if it has any
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {NamedImportBindings}
	 */
	public getNamedImportBindingsForImportDeclaration (importDeclaration: ImportDeclaration): NamedImportBindings|undefined {
		// Return undefined if
		// 1. The import has no importClause (in which case it just imports the path)
		// 2. if it doesn't have any named bindings
		if (
			importDeclaration.importClause == null ||
			importDeclaration.importClause.namedBindings == null
		) return;

		return importDeclaration.importClause.namedBindings;
	}

	/**
	 * Creates an ImportDeclaration and adds it to the provided SourceFile
	 * @param {IImportCtor} options
	 * @param {SourceFile} sourceFile
	 * @param {IPlacement} [placement]
	 * @returns {ImportDeclaration}
	 */
	public createAndAddImportDeclarationToSourceFile (options: IImportCtor, sourceFile: SourceFile, placement: IPlacement = {position: "BEFORE"}): ImportDeclaration {
		const importDeclaration = this.createImportDeclaration(options);

		// Update the SourceFile to reflect the change
		this.updater.updateSourceFileStatements(
			this.joiner.joinStatementNodeArrays(createNodeArray([importDeclaration]), sourceFile.statements, placement),
			sourceFile
		);

		return importDeclaration;
	}

	/**
	 * Removes the given ImportDeclaration from its SourceFile
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public removeImportDeclaration (importDeclaration: ImportDeclaration): boolean {
		const sourceFile = importDeclaration.getSourceFile();

		// Take all statements that isn't the provided ImportDeclaration
		const filtered = sourceFile.statements.filter(statement => statement !== importDeclaration);

		// Return false if the import wasn't included in the statements of the SourceFile
		if (filtered.length === sourceFile.statements.length) return false;

		// Update the SourceFile to reflect the change
		this.updater.updateSourceFileStatements(
			createNodeArray(filtered),
			sourceFile
		);

		return true;
	}

	/**
	 * Removes all ImportDeclarations with the given path in the given SourceFile
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {boolean}
	 */
	public removeImportDeclarationsWithPath (path: string, sourceFile: SourceFile): boolean {
		const importDeclarations = this.getImportsForPath(path, sourceFile);
		// If none were matched, return false
		if (importDeclarations.length < 1) return false;

		// Otherwise, call removeImportDeclaration for each of them and store their results
		const results = importDeclarations.map(importDeclaration => this.removeImportDeclaration(importDeclaration));

		// Return true if at least 1 of the results were equal to true
		return results.some(result => result === true);
	}

	/**
	 * Creates a new ImportDeclaration
	 * @param {IImportCtor} options
	 * @returns {ImportDeclaration}
	 */
	public createImportDeclaration (options: IImportCtor): ImportDeclaration {
		return this.formatter.formatImportDeclaration(options);
	}

	/**
	 * Changes the path of an ImportDeclaration
	 * @param {string} path
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public changePathOfImportDeclaration (path: string, importDeclaration: ImportDeclaration): ImportDeclaration {
		// If the ImportDeclaration already imports from the path, do nothing
		if (this.getPathForImportDeclaration(importDeclaration) === path) {
			return importDeclaration;
		}

		// Generate a StringLiteral for the path
		const moduleSpecifier = this.formatter.formatStringLiteral(path);

		return this.updater.updateImportDeclarationModuleSpecifier(moduleSpecifier, importDeclaration);
	}

	/**
	 * Adds a specific default name to an ImportDeclaration, unless it has that name already
	 * @param {string} name
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public addNameToImportDeclaration (name: string, importDeclaration: ImportDeclaration): ImportDeclaration {
		// If the importDeclaration already has the provided name as default import name, do nothing
		if (this.hasSpecificName(name, importDeclaration)) return importDeclaration;

		// Map the ImportClause back to a dict
		const mappedImportClauseCtor = this.nodeToCtorMapper.toIImportClauseCtor(importDeclaration.importClause);

		return this.updater.updateImportDeclarationImportClause(
			mappedImportClauseCtor == null
				? undefined
				: this.formatter.formatImportClause({...mappedImportClauseCtor, defaultName: name}),
			importDeclaration
		);
	}

	/**
	 * Adds a namespace import to an Import Declaration, if it doesn't already include one with the provided name
	 * @param {string} namespaceName
	 * @param {ts.ImportDeclaration} importDeclaration
	 * @returns {ts.ImportDeclaration}
	 */
	public addNamespaceImportToImportDeclaration (namespaceName: string, importDeclaration: ImportDeclaration): ImportDeclaration {
		// If the importDeclaration already has the namespace import with the requested name, do nothing
		if (this.hasNamespaceImportWithName(namespaceName, importDeclaration)) return importDeclaration;

		// Map the ImportClause back to a dict
		const mappedImportClauseCtor = this.nodeToCtorMapper.toIImportClauseCtor(importDeclaration.importClause);

		// Format a new ImportClause
		const formatted = this.formatter.formatImportClause(
			mappedImportClauseCtor == null
				// If the ImportDeclaration didn't have an ImportClause, format a new one with only the Namespace name defined
				? {defaultName: null, namespace: namespaceName, namedImports: null}
				// Otherwise, reuse it but overwrite the namespace name
				: {...mappedImportClauseCtor, namespace: namespaceName}
		);

		return this.updater.updateImportDeclarationImportClause(
			formatted,
			importDeclaration
		);
	}

	/**
	 * Adds a NamedImport to an ImportDeclaration if it doesn't include it already
	 * @param {INamedImportExportCtor} namedImport
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public addNamedImportToImportDeclaration (namedImport: INamedImportExportCtor, importDeclaration: ImportDeclaration): ImportDeclaration {
		// If the importDeclaration already has the named import, do nothing
		if (this.hasNamedImport(namedImport, importDeclaration)) return importDeclaration;

		// If the import declaration already has named imports, just add the import to the existing named imports
		if (this.hasNamedImports(importDeclaration)) {
			this.namedImportsService.addImportToNamedImports(namedImport, <NamedImports> importDeclaration.importClause!.namedBindings);

			// Return the ImportDeclaration
			return importDeclaration;
		}

		// Otherwise, format a new ImportClause and set it on the ImportDeclaration
		// Map the ImportClause back to a dict
		const mappedImportClauseCtor = this.nodeToCtorMapper.toIImportClauseCtor(importDeclaration.importClause);

		// Format a new ImportClause
		const formatted = this.formatter.formatImportClause(
			// If it had no ImportClause, generate a new one with only the NamedImports set since it will have no default name or namespace
			mappedImportClauseCtor == null
				? {defaultName: null, namespace: null, namedImports: [namedImport]}
				// Otherwise, reuse it, but append the NamedImport the existing ones
				: {...mappedImportClauseCtor, namedImports: mappedImportClauseCtor.namedImports == null ? [namedImport] : [...mappedImportClauseCtor.namedImports, namedImport]}
		);

		// Update the ImportDeclaration ImportClause
		return this.updater.updateImportDeclarationImportClause(
			formatted,
			importDeclaration
		);
	}
}