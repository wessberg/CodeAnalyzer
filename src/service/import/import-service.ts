import {createNodeArray, Identifier, ImportDeclaration, isNamedImports, isNamespaceImport, isStringLiteral, NamedImportBindings, NamedImports, NamespaceImport, NodeArray, SourceFile, SyntaxKind} from "typescript";
import {IImportService} from "./i-import-service";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IImportDict} from "../../dict/import/i-import-dict";
import {INamedImportDict} from "../../dict/named-import/i-named-import-dict";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {INamedImportsService} from "../named-imports/i-named-imports-service";
import {INamespaceImportService} from "../namespace-import/i-namespace-import-service";
import {IUpdater} from "../../updater/i-updater-getter";
import {INodeToDictMapper} from "../../node-to-dict-mapper/i-node-to-dict-mapper";
import {NodeService} from "../node/node-service";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";

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
							 private nodeToDictMapper: INodeToDictMapper,
							 private formatter: IFormatter,
							 private printer: IPrinter,
							 private updater: IUpdater,
							 astUtil: ITypescriptASTUtil,
							 decoratorService: IDecoratorService,
							 remover: IRemover) {
		super(decoratorService, remover, astUtil);
	}

	/**
	 * Gets the import path of an ImportDeclaration
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {string}
	 */
	public getPathForImportDeclaration (importDeclaration: ImportDeclaration): string {
		return this.printer.print(importDeclaration.moduleSpecifier);
	}

	/**
	 * Gets all ImportDeclarations that refers to the provided path in the provided sourceFile
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {NodeArray<ImportDeclaration>}
	 */
	public getImportsForPath (path: string, sourceFile: SourceFile): NodeArray<ImportDeclaration> {
		const imports = this.getAll(sourceFile);
		return createNodeArray(imports.filter(importDeclaration => isStringLiteral(importDeclaration.moduleSpecifier) && importDeclaration.moduleSpecifier.text === path));
	}

	/**
	 * Gets the ImportDeclarations that refers to the provided path and
	 * has a named import matching the provided one in the provided SourceFile
	 * @param namedImport
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {NodeArray<ImportDeclaration>}
	 */
	public getImportsWithNamedImport (namedImport: INamedImportDict, path: string, sourceFile: SourceFile): NodeArray<ImportDeclaration> {
		const imports = this.getImportsForPath(path, sourceFile);
		return createNodeArray(imports.filter(importDeclaration => this.hasNamedImport(namedImport, importDeclaration)));
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
	 * @param {INamedImportDict} namedImport
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasNamedImport (namedImport: INamedImportDict, importDeclaration: ImportDeclaration): boolean {
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
	 * @param {IImportDict} options
	 * @param {SourceFile} sourceFile
	 * @returns {ImportDeclaration}
	 */
	public createAndAddImportDeclarationToSourceFile (options: IImportDict, sourceFile: SourceFile): ImportDeclaration {
		const importDeclaration = this.createImportDeclaration(options);

		// Update the SourceFile to reflect the change
		this.updater.addStatement(
			importDeclaration,
			sourceFile
		);

		return importDeclaration;
	}

	/**
	 * Creates a new ImportDeclaration
	 * @param {IImportDict} options
	 * @returns {ImportDeclaration}
	 */
	public createImportDeclaration (options: IImportDict): ImportDeclaration {
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
		const mappedImportClauseDict = this.nodeToDictMapper.toImportClauseDict(importDeclaration.importClause);

		return this.updater.updateImportDeclarationImportClause(
			mappedImportClauseDict == null
				? undefined
				: this.formatter.formatImportClause({...mappedImportClauseDict, defaultName: name}),
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
		const mappedImportClauseDict = this.nodeToDictMapper.toImportClauseDict(importDeclaration.importClause);

		// Format a new ImportClause
		const formatted = this.formatter.formatImportClause(
			mappedImportClauseDict == null
				// If the ImportDeclaration didn't have an ImportClause, format a new one with only the Namespace name defined
				? {defaultName: null, namespace: namespaceName, namedImports: null}
				// Otherwise, reuse it but overwrite the namespace name
				: {...mappedImportClauseDict, namespace: namespaceName}
		);

		return this.updater.updateImportDeclarationImportClause(
			formatted,
			importDeclaration
		);
	}

	/**
	 * Adds a NamedImport to an ImportDeclaration if it doesn't include it already
	 * @param {INamedImportDict} namedImport
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public addNamedImportToImportDeclaration (namedImport: INamedImportDict, importDeclaration: ImportDeclaration): ImportDeclaration {
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
		const mappedImportClauseDict = this.nodeToDictMapper.toImportClauseDict(importDeclaration.importClause);

		// Format a new ImportClause
		const formatted = this.formatter.formatImportClause(
			// If it had no ImportClause, generate a new one with only the NamedImports set since it will have no default name or namespace
			mappedImportClauseDict == null
				? {defaultName: null, namespace: null, namedImports: [namedImport]}
				// Otherwise, reuse it, but append the NamedImport the existing ones
				: {...mappedImportClauseDict, namedImports: mappedImportClauseDict.namedImports == null ? [namedImport] : [...mappedImportClauseDict.namedImports, namedImport]}
		);

		// Update the ImportDeclaration ImportClause
		return this.updater.updateImportDeclarationImportClause(
			formatted,
			importDeclaration
		);
	}
}