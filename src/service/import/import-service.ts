import {ImportDeclaration, SourceFile} from "typescript";
import {IImportService} from "./i-import-service";
import {ImportHelper, INodeUpdaterUtil, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IImportDict} from "../../dict/import/i-import-dict";
import {INamedImportDict} from "../../dict/import/i-named-import-dict";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IFormatter} from "../../formatter/i-formatter";

/**
 * A class that helps with working with ImportDeclarations through the Typescript ASt
 */
export class ImportService extends ImportHelper implements IImportService {
	constructor (private languageService: ITypescriptLanguageService,
							 private nodeUpdater: INodeUpdaterUtil,
							 private formatter: IFormatter,
							 astUtil: ITypescriptASTUtil) {
		super(astUtil);
	}

	/**
	 * Creates an ImportDeclaration and adds it to the provided SourceFile
	 * @param {IImportDict} options
	 * @param {SourceFile} sourceFile
	 * @returns {ImportDeclaration}
	 */
	public createAndAddImportDeclarationToSourceFile (options: IImportDict, sourceFile: SourceFile): ImportDeclaration {
		const importDeclaration = this.createImportDeclaration(options);
		return this.nodeUpdater.addInPlace(importDeclaration, sourceFile, this.languageService);
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
	 * @param {INamedImportDict} namedImport
	 * @param {ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public addNamedImportToImportDeclaration (namedImport: INamedImportDict, importDeclaration: ImportDeclaration): ImportDeclaration {
		// If the importDeclaration already has the named import, do nothing
		if (this.hasNamedImport(namedImport, importDeclaration)) return importDeclaration;

		// Take all existing named imports
		const namedImports = this.getNamedImportsForImportDeclaration(importDeclaration);

		// Merge the imports and deduplicate them
		const mergedNamedImports: Set<INamedImportDict> = new Set([namedImport, ...(namedImports == null ? [] : namedImports.elements.map(element => ({name: element.name.text, propertyName: element.propertyName == null ? null : element.propertyName.text})))]);

		return this.formatter.updateImportDeclaration({namedImports: mergedNamedImports}, importDeclaration);
	}
}