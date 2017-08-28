import {createNodeArray, Identifier, NodeArray, SyntaxKind} from "typescript";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IIdentifierExpressionService} from "./i-identifier-expression-service";
import {AstNode} from "../../type/ast-node/ast-node";
import {IdentifierFormatterGetter} from "../../formatter/expression/identifier/identifier-formatter-getter";
import {IFormattedIdentifier} from "@wessberg/type";

/**
 * A class that can generate IFormattedIdentifierExpressions
 */
export class IdentifierExpressionService implements IIdentifierExpressionService {
	/**
	 * The Set of supported SyntaxKinds
	 * @type {Set<SyntaxKind>}
	 */
	public readonly supportedKinds: Set<SyntaxKind> = new Set([SyntaxKind.Identifier]);

	constructor (private astUtil: ITypescriptASTUtil,
							 private languageService: ITypescriptLanguageService,
							 private identifierExpressionFormatter: IdentifierFormatterGetter) {
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForFile (file: string): IFormattedIdentifier[] {
		return this.getIdentifiersForStatements(this.languageService.addFile({path: file, addImportedFiles: true}));
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
		const filtered = this.astUtil.filterStatements<Identifier>(statements, this.supportedKinds, true);
		return filtered.map(statement => this.identifierExpressionFormatter().format(statement));
	}

}