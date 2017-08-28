import {ICodeAnalyzer} from "./i-code-analyzer";
import {FormattedFunction, IFormattedCallExpression, IFormattedClass, IFormattedIdentifier, IInterfaceType} from "@wessberg/type";
import {ArrowFunction, CallExpression, ClassDeclaration, ClassExpression, FunctionDeclaration, FunctionExpression, Identifier, InterfaceDeclaration, NodeArray, Statement} from "typescript";
import {AstNode} from "../type/ast-node/ast-node";
import {callExpressionServiceGetter, classServiceGetter, functionServiceGetter, identifierExpressionServiceGetter, importServiceGetter, interfaceTypeServiceGetter, languageService} from "../services";
import {ICodeAnalyzerOptions} from "./i-code-analyzer-options";

/**
 * A service that can analyze your code in great detail ahead of time.
 */
export class CodeAnalyzer implements ICodeAnalyzer {

	constructor (options?: Partial<ICodeAnalyzerOptions>) {
		if (options != null && options.excludedFiles != null) {
			this.excludeFiles(options.excludedFiles);
		}
	}

	/**
	 * Excludes files from the CodeAnalyzer that matches the provided Regular Expression(s)
	 * @param {RegExp | Iterable<RegExp>} match
	 */
	public excludeFiles (match: RegExp|Iterable<RegExp>): void {
		languageService.excludeFiles(match);
	}

	/**
	 * Gets all imported files for the given file
	 * @param {string} file
	 * @returns {string[]}
	 */
	public getImportedFilesForFile (file: string): string[] {
		return importServiceGetter().getImportedFilesForFile(file);
	}

	/**
	 * Gets all imported files for the file holding the provided statement
	 * @param {AstNode} statement
	 * @returns {string[]}
	 */
	public getImportedFilesForStatementFile (statement: AstNode): string[] {
		return importServiceGetter().getImportedFilesForStatementFile(statement);
	}

	/**
	 * Gets all FormattedFunctions for the given file
	 * @param {string} file
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForFile (file: string): FormattedFunction[] {
		return functionServiceGetter().getFunctionsForFile(file);
	}

	/**
	 * Gets all FormattedFunctions for the given statement
	 * @param {FunctionExpression|FunctionDeclaration|ArrowFunction} statement
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForStatement (statement: FunctionExpression|FunctionDeclaration|ArrowFunction): FormattedFunction[] {
		return functionServiceGetter().getFunctionsForStatement(statement);
	}

	/**
	 * Gets all FormattedFunctions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForStatements (statements: NodeArray<AstNode>): FormattedFunction[] {
		return functionServiceGetter().getFunctionsForStatements(statements);
	}

	/**
	 * Gets all IFormattedClasses for the given file
	 * @param {string} file
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForFile (file: string): IFormattedClass[] {
		return classServiceGetter().getClassesForFile(file);
	}

	/**
	 * Gets all IFormattedClass for the given statement
	 * @param {ClassExpression|ClassDeclaration} statement
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForStatement (statement: ClassExpression|ClassDeclaration): IFormattedClass[] {
		return classServiceGetter().getClassesForStatement(statement);
	}

	/**
	 * Gets all IFormattedClass for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForStatements (statements: NodeArray<AstNode>): IFormattedClass[] {
		return classServiceGetter().getClassesForStatements(statements);
	}

	/**
	 * Gets all IInterfaceTypes for the given file
	 * @param {string} file
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForFile (file: string): IInterfaceType[] {
		return interfaceTypeServiceGetter().getInterfacesForFile(file);
	}

	/**
	 * Gets all IInterfaceTypes for the given statement
	 * @param {InterfaceDeclaration} statement
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForStatement (statement: InterfaceDeclaration): IInterfaceType[] {
		return interfaceTypeServiceGetter().getInterfacesForStatement(statement);
	}

	/**
	 * Gets all IInterfaceTypes for the given Statements
	 * @param {NodeArray<Statement>} statements
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForStatements (statements: NodeArray<Statement>): IInterfaceType[] {
		return interfaceTypeServiceGetter().getInterfacesForStatements(statements);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForFile (file: string): IFormattedCallExpression[] {
		return callExpressionServiceGetter().getCallExpressionsForFile(file);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given statement
	 * @param {CallExpression} statement
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForStatement (statement: CallExpression): IFormattedCallExpression[] {
		return callExpressionServiceGetter().getCallExpressionsForStatement(statement);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForStatements (statements: NodeArray<AstNode>): IFormattedCallExpression[] {
		return callExpressionServiceGetter().getCallExpressionsForStatements(statements);
	}

	/**
	 * Finds all the call expressions in the provided file that matches the provided match which can be a string or a regular expression
	 * @param {string} file
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForFile (file: string, match: string|RegExp): IFormattedCallExpression[] {
		return callExpressionServiceGetter().findMatchingCallExpressionsForFile(file, match);
	}

	/**
	 * Finds all the call expressions for the provided statement that matches the provided match which can be a string or a regular expression
	 * @param {ts.CallExpression} statement
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForStatement (statement: CallExpression, match: string|RegExp): IFormattedCallExpression[] {
		return callExpressionServiceGetter().findMatchingCallExpressionsForStatement(statement, match);
	}

	/**
	 * Finds all the call expressions for the provided statements that matches the provided match which can be a string or a regular expression
	 * @param {ts.NodeArray<AstNode>} statements
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForStatements (statements: NodeArray<AstNode>, match: string|RegExp): IFormattedCallExpression[] {
		return callExpressionServiceGetter().findMatchingCallExpressionsForStatements(statements, match);
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForFile (file: string): IFormattedIdentifier[] {
		return identifierExpressionServiceGetter().getIdentifiersForFile(file);
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given statement
	 * @param {Identifier} statement
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForStatement (statement: Identifier): IFormattedIdentifier[] {
		return identifierExpressionServiceGetter().getIdentifiersForStatement(statement);
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForStatements (statements: NodeArray<AstNode>): IFormattedIdentifier[] {
		return identifierExpressionServiceGetter().getIdentifiersForStatements(statements);
	}
}