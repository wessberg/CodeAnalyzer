import {CallExpression, createNodeArray, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {ICallExpressionService} from "./i-call-expression-service";
import {IFormattedCallExpression} from "../../formatter/expression/call-expression/i-formatted-call-expression";
import {AstNode} from "../../type/ast-node";
import {CallExpressionFormatterGetter} from "../../formatter/expression/call-expression/call-expression-formatter-getter";

/**
 * A class that can generate IFormattedCallExpressions
 */
export class CallExpressionService implements ICallExpressionService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.CallExpression]);

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private callExpressionFormatter: CallExpressionFormatterGetter) {
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
		return this.getCallExpressionsForStatements(this.languageService.addFile({path: file}));
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