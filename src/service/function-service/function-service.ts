import {ArrowFunction, createNodeArray, FunctionDeclaration, FunctionExpression, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFunctionService} from "./i-function-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {FormattedFunction} from "@wessberg/type";
import {FunctionFormatterGetter} from "../../formatter/expression/function/function-formatter-getter";

/**
 * A class that can generate FormattedFunctions
 */
export class FunctionService implements IFunctionService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.FunctionExpression, SyntaxKind.FunctionDeclaration, SyntaxKind.ArrowFunction]);

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private functionFormatter: FunctionFormatterGetter) {
	}

	/**
	 * Gets all FormattedFunctions for the given file
	 * @param {string} file
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForFile (file: string): FormattedFunction[] {
		return this.getFunctionsForStatements(this.languageService.addFile({path: file, addImportedFiles: true}));
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