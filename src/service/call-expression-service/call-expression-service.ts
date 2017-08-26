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

}