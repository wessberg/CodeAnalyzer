import {createNodeArray, Identifier, ImportDeclaration, isNamedImports, isNamespaceImport, isStringLiteral, NamedImportBindings, NamedImports, NamespaceImport, NodeArray, SourceFile, SyntaxKind} from "typescript";
import {IImportService} from "./i-import-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IImportDict} from "../../dict/import/i-import-dict";
import {IFormatter} from "../../formatter/i-formatter";

/**
 * A class that helps with working with ImportDeclarations through the Typescript ASt
 */
export class ImportService implements IImportService {

	constructor (private astUtil: ITypescriptASTUtil, private formatter: IFormatter) {
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
	 * @param {ts.ImportDeclaration} importDeclaration
	 * @returns {ts.ImportDeclaration}
	 */
	public changePathOfImportDeclaration (path: string, importDeclaration: ImportDeclaration): ImportDeclaration {
		return this.formatter.updateImportDeclaration({path}, importDeclaration);
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
	 * Adds a specific default name to an ImportDeclaration, unless it has that name already
	 * @param {string} name
	 * @param {ts.ImportDeclaration} importDeclaration
	 * @returns {ts.ImportDeclaration}
	 */
	public addNameToImportDeclaration (name: string, importDeclaration: ImportDeclaration): ImportDeclaration {
		// If the importDeclaration already has the provided name as default import name, do nothing
		if (this.hasSpecificName(name, importDeclaration)) return importDeclaration;

		return this.formatter.updateImportDeclaration({defaultName: name}, importDeclaration);
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

		return this.formatter.updateImportDeclaration({namespace: namespaceName}, importDeclaration);
	}

	/**
	 * Adds a NamedImport to an ImportDeclaration if it doesn't include it already
	 * @param {string} namedImport
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public addNamedImportToImportDeclaration (namedImport: string, importDeclaration: ImportDeclaration): ImportDeclaration {
		// If the importDeclaration already has the named import, do nothing
		if (this.hasNamedImport(namedImport, importDeclaration)) return importDeclaration;

		// Take all existing named imports
		const namedImports = this.getNamedImportsForImportDeclaration(importDeclaration);

		// Merge the imports and deduplicate them
		const mergedNamedImports = new Set([namedImport, ...(namedImports == null ? [] : namedImports.elements.map(element => element.name.text))]);

		return this.formatter.updateImportDeclaration({namedImports: mergedNamedImports}, importDeclaration);
	}

	/**
	 * Gets all ImportDeclarations for the provided SourceFile
	 * @param {SourceFile} sourceFile
	 * @returns {NodeArray<ImportDeclaration>}
	 */
	public getImports (sourceFile: SourceFile): NodeArray<ImportDeclaration> {
		return this.astUtil.getFilteredStatements(sourceFile.statements, SyntaxKind.ImportDeclaration);
	}

	/**
	 * Gets all ImportDeclarations that refers to the provided path in the provided sourceFile
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {NodeArray<ImportDeclaration>}
	 */
	public getImportsForPath (path: string, sourceFile: SourceFile): NodeArray<ImportDeclaration> {
		const imports = this.getImports(sourceFile);
		return createNodeArray(imports.filter(importDeclaration => isStringLiteral(importDeclaration.moduleSpecifier) && importDeclaration.moduleSpecifier.text === path));
	}

	/**
	 * Gets the ImportDeclarations that refers to the provided path and
	 * has a named import matching the provided one in the provided SourceFile
	 * @param {string} namedImport
	 * @param {string} path
	 * @param {SourceFile} sourceFile
	 * @returns {NodeArray<ImportDeclaration>}
	 */
	public getImportsWithNamedImport (namedImport: string, path: string, sourceFile: SourceFile): NodeArray<ImportDeclaration> {
		const imports = this.getImportsForPath(path, sourceFile);
		return createNodeArray(imports.filter(importDeclaration => {

			// Take the NamedImports for the ImportDeclaration
			const namedImports = this.getNamedImportsForImportDeclaration(importDeclaration);

			// There is match if any of the named imports matches the name that we're looking for.
			return namedImports != null && namedImports.elements.some(element => element.name.text === namedImport);
		}));
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
	 * @param {string} namedImport
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {boolean}
	 */
	public hasNamedImport (namedImport: string, importDeclaration: ImportDeclaration): boolean {
		const namedImports = this.getNamedImportsForImportDeclaration(importDeclaration);
		if (namedImports == null) return false;
		return namedImports.elements.find(element => element.name.text === namedImport) != null;
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
		if (namespace == null) return false;

		return namespace.name.text === namespaceName;
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

}