import {createNodeArray, Identifier, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IIdentifierService} from "./i-identifier-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {IdentifierFormatterGetter} from "../../formatter/expression/identifier/identifier-formatter-getter";
import {IFormattedIdentifier} from "@wessberg/type";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";

/**
 * A class that can generate IFormattedIdentifiers
 */
export class IdentifierService implements IIdentifierService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.Identifier]);

	/**
	 * A Set of all files that is currently being checked for identifiers
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForIdentifiers: Set<string> = new Set();

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private identifierFormatter: IdentifierFormatterGetter,
							 private cacheService: CacheServiceGetter) {
	}

	/**
	 * Returns true if the given file is currently being analyzed for identifiers
	 * @param {string} file
	 * @returns {boolean}
	 */
	public isGettingIdentifiersForFile (file: string): boolean {
		return this.filesBeingAnalyzedForIdentifiers.has(file);
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForFile (file: string): IFormattedIdentifier[] {
		const pathInfo = this.languageService.getPathInfo(file);
		const statements = this.languageService.addFile(pathInfo);

		// If classes are currently being analyzed for the file, return an empty array
		if (this.isGettingIdentifiersForFile(pathInfo.normalizedPath)) return [];
		// Refresh the identifiers if required
		if (this.cacheService().cachedIdentifiersNeedsUpdate(pathInfo.normalizedPath)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForIdentifiers.add(pathInfo.normalizedPath);

			// Get the identifiers
			const identifiers = this.getIdentifiersForStatements(statements);

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForIdentifiers.delete(pathInfo.normalizedPath);

			// Cache and return the identifiers
			return this.cacheService().setCachedIdentifiersForFile(pathInfo.normalizedPath, identifiers);
		}
		// Otherwise, return the cached identifiers
		else {
			return this.cacheService().getCachedIdentifiersForFile(pathInfo.normalizedPath)!;
		}
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given statement
	 * @param {Identifier} statement
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForStatement (statement: Identifier): IFormattedIdentifier[] {
		return this.getIdentifiersForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForStatements (statements: NodeArray<AstNode>): IFormattedIdentifier[] {
		const expressions: IFormattedIdentifier[] = [];
		const formatter = this.identifierFormatter();
		this.astUtil.filterStatements<Identifier>(expression => expressions.push(formatter.format(expression)), statements, this.supportedKinds, true);
		return expressions;
	}

}