import {IInterfaceTypeService} from "./i-interface-type-service";
import {IFormattedInterfaceType} from "@wessberg/type";
import {createNodeArray, InterfaceDeclaration, NodeArray, Statement, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {InterfaceTypeFormatterGetter} from "../../formatter/type/interface-type-formatter/interface-type-formatter-getter";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";

/**
 * A class that can generate IInterfaceTypes
 */
export class InterfaceTypeService implements IInterfaceTypeService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.InterfaceDeclaration]);

	/**
	 * A Set of all files that is currently being checked for interfaces
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForInterfaces: Set<string> = new Set();

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private interfaceTypeFormatter: InterfaceTypeFormatterGetter,
							 private cacheService: CacheServiceGetter) {
	}

	/**
	 * Returns true if the given file is currently being analyzed for interfaces
	 * @param {string} file
	 * @returns {boolean}
	 */
	public isGettingInterfacesForFile (file: string): boolean {
		return this.filesBeingAnalyzedForInterfaces.has(file);
	}

	/**
	 * Gets all IInterfaceTypes for the given file
	 * @param {string} file
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForFile (file: string): IFormattedInterfaceType[] {
		// Refresh the functions if required
		if (this.cacheService().cachedInterfacesNeedsUpdate(file)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForInterfaces.add(file);

			// Get the functions
			const interfaces = this.getInterfacesForStatements(this.languageService.addFile({path: file}));

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForInterfaces.delete(file);

			// Cache and return the functions
			return this.cacheService().setCachedInterfacesForFile(file, interfaces);
		}
		// Otherwise, return the cached functions
		else {
			return this.cacheService().getCachedInterfacesForFile(file)!;
		}
	}

	/**
	 * Gets all IInterfaceTypes for the given statement
	 * @param {InterfaceDeclaration} statement
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForStatement (statement: InterfaceDeclaration): IFormattedInterfaceType[] {
		return this.getInterfacesForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all IInterfaceTypes for the given Statements
	 * @param {NodeArray<Statement>} statements
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForStatements (statements: NodeArray<Statement>): IFormattedInterfaceType[] {
		const filtered = this.astUtil.filterStatements<InterfaceDeclaration>(statements, this.supportedKinds, true);
		return filtered.map(statement => this.interfaceTypeFormatter().format(statement));
	}

}