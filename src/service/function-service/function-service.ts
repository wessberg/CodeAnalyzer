import {ArrowFunction, createNodeArray, FunctionDeclaration, FunctionExpression, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFunctionService} from "./i-function-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {FormattedFunction} from "@wessberg/type";
import {FunctionFormatterGetter} from "../../formatter/expression/function/function-formatter-getter";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";

/**
 * A class that can generate FormattedFunctions
 */
export class FunctionService implements IFunctionService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.FunctionExpression, SyntaxKind.FunctionDeclaration, SyntaxKind.ArrowFunction]);

	/**
	 * A Set of all files that is currently being checked for functions
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForFunctions: Set<string> = new Set();

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private functionFormatter: FunctionFormatterGetter,
							 private cacheService: CacheServiceGetter) {
	}

	/**
	 * Returns true if the given file is currently being analyzed for functions
	 * @param {string} file
	 * @returns {boolean}
	 */
	public isGettingFunctionsForFile (file: string): boolean {
		return this.filesBeingAnalyzedForFunctions.has(file);
	}

	/**
	 * Gets all FormattedFunctions for the given file
	 * @param {string} file
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForFile (file: string): FormattedFunction[] {
		// Refresh the functions if required
		if (this.cacheService().cachedFunctionsNeedsUpdate(file)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForFunctions.add(file);

			// Get the functions
			const functions = this.getFunctionsForStatements(this.languageService.addFile({path: file}));

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForFunctions.delete(file);

			// Cache and return the functions
			return this.cacheService().setCachedFunctionsForFile(file, functions);
		}
		// Otherwise, return the cached functions
		else {
			return this.cacheService().getCachedFunctionsForFile(file)!;
		}
	}

	/**
	 * Gets all FormattedFunctions for the given statement
	 * @param {FunctionExpression|FunctionDeclaration|ArrowFunction} statement
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForStatement (statement: FunctionExpression|FunctionDeclaration|ArrowFunction): FormattedFunction[] {
		return this.getFunctionsForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all FormattedFunctions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForStatements (statements: NodeArray<AstNode>): FormattedFunction[] {
		const filtered = this.astUtil.filterStatements<FunctionExpression|FunctionDeclaration|ArrowFunction>(statements, this.supportedKinds, true);
		return filtered.map(statement => this.functionFormatter().format(statement));
	}
}