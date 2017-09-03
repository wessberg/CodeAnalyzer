import {CallExpression, createNodeArray, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ICallExpressionService} from "./i-call-expression-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {CallExpressionFormatterGetter} from "../../formatter/expression/call-expression/call-expression-formatter-getter";
import {IFormattedCallExpression} from "@wessberg/type";
import {CacheServiceGetter} from "../cache-service/cache-service-getter";

/**
 * A class that can generate IFormattedCallExpressions
 */
export class CallExpressionService implements ICallExpressionService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.CallExpression]);

	/**
	 * A Set of all files that is currently being checked for call expressions
	 * @type {Set<string>}
	 */
	private readonly filesBeingAnalyzedForCallExpressions: Set<string> = new Set();

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private callExpressionFormatter: CallExpressionFormatterGetter,
							 private cacheService: CacheServiceGetter) {
	}

	/**
	 * Returns true if the given file is currently being analyzed for call expressions
	 * @param {string} file
	 * @returns {boolean}
	 */
	public isGettingCallExpressionsForFile (file: string): boolean {
		return this.filesBeingAnalyzedForCallExpressions.has(file);
	}

	/**
	 * Finds all the call expressions in the provided file that matches the provided match which can be a string or a regular expression
	 * @param {string} file
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForFile (file: string, match: string|RegExp): IFormattedCallExpression[] {
		return this.filterFormattedCallExpressionsByMatch(this.getCallExpressionsForFile(file), match);
	}

	/**
	 * Finds all the call expressions for the provided statement that matches the provided match which can be a string or a regular expression
	 * @param {ts.CallExpression} statement
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForStatement (statement: CallExpression, match: string|RegExp): IFormattedCallExpression[] {
		return this.filterFormattedCallExpressionsByMatch(this.getCallExpressionsForStatement(statement), match);
	}

	/**
	 * Finds all the call expressions for the provided statements that matches the provided match which can be a string or a regular expression
	 * @param {ts.NodeArray<AstNode>} statements
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForStatements (statements: NodeArray<AstNode>, match: string|RegExp): IFormattedCallExpression[] {
		return this.filterFormattedCallExpressionsByMatch(this.getCallExpressionsForStatements(statements), match);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForFile (file: string): IFormattedCallExpression[] {
		// Refresh the call expressions if required
		if (this.cacheService().cachedCallExpressionsNeedsUpdate(file)) {
			// Mark the file as being analyzed
			this.filesBeingAnalyzedForCallExpressions.add(file);

			// Get the call expressions
			const callExpressions = this.getCallExpressionsForStatements(this.languageService.addFile({path: file}));

			// Un-mark the file from being analyzed
			this.filesBeingAnalyzedForCallExpressions.delete(file);

			// Cache and return the call expressions
			return this.cacheService().setCachedCallExpressionsForFile(file, callExpressions);
		}
		// Otherwise, return the cached call expressions
		else {
			return this.cacheService().getCachedCallExpressionsForFile(file)!;
		}
	}

	/**
	 * Gets all IFormattedCallExpressions for the given statement
	 * @param {CallExpression} statement
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForStatement (statement: CallExpression): IFormattedCallExpression[] {
		return this.getCallExpressionsForStatements(createNodeArray([statement]));
	}

	/**
	 * Gets all IFormattedCallExpressions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForStatements (statements: NodeArray<AstNode>): IFormattedCallExpression[] {
		const filtered = this.astUtil.filterStatements<CallExpression>(statements, this.supportedKinds, true);
		return filtered.map(statement => this.callExpressionFormatter().format(statement));
	}

	/**
	 * Filters only the expressions that matches the provided 'match' string or Regular Expression.
	 * If a string is given, it will match if the string representation of the call expression starts with the value of the string
	 * @param {IFormattedCallExpression[]} formattedExpressions
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	private filterFormattedCallExpressionsByMatch (formattedExpressions: IFormattedCallExpression[], match: string|RegExp): IFormattedCallExpression[] {
		return formattedExpressions.filter(formattedExpression => match instanceof RegExp ? match.test(formattedExpression.toString()) : formattedExpression.toString().startsWith(match));
	}

}