import {ICodeAnalyzer} from "./i-code-analyzer";
import {FormattedExpression, FormattedFunction, IFormattedCallExpression, IFormattedClass, IFormattedExport, IFormattedIdentifier, IFormattedImport, IFormattedInterfaceType} from "@wessberg/type";
import {ArrowFunction, CallExpression, ClassDeclaration, ClassExpression, ExportDeclaration, FunctionDeclaration, FunctionExpression, Identifier, ImportDeclaration, InterfaceDeclaration, NodeArray, Statement} from "typescript";
import {AstNode} from "../type/ast-node/ast-node";
import {callExpressionServiceGetter, classServiceGetter, exportServiceGetter, functionServiceGetter, identifierExpressionServiceGetter, importServiceGetter, interfaceTypeServiceGetter, languageService, resolverServiceGetter} from "../services";

/**
 * A service that can analyze your code in great detail ahead of time.
 */
export class CodeAnalyzer implements ICodeAnalyzer {

	/**
	 * Gets all IFormattedImports for the given file
	 * @param {string} file
	 * @param {string} [content]
	 * @returns {IFormattedImport[]}
	 */
	public getImportsForFile (file: string, content?: string): IFormattedImport[] {
		return importServiceGetter().getImportsForFile(file, content);
	}

	/**
	 * Gets all IFormattedImports for the given statement
	 * @param {ImportDeclaration} statement
	 * @returns {IFormattedImport[]}
	 */
	public getImportsForStatement (statement: ImportDeclaration): IFormattedImport[] {
		return importServiceGetter().getImportsForStatement(statement);
	}

	/**
	 * Gets all IFormattedImports for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedImport[]}
	 */
	public getImportsForStatements (statements: NodeArray<AstNode>): IFormattedImport[] {
		return importServiceGetter().getImportsForStatements(statements);
	}

	/**
	 * Gets all IFormattedExports for the given file
	 * @param {string} file
	 * @param {string} [content]
	 * @returns {IFormattedExport[]}
	 */
	public getExportsForFile (file: string, content?: string): IFormattedExport[] {
		return exportServiceGetter().getExportsForFile(file, content);
	}

	/**
	 * Gets all IFormattedExports for the given statement
	 * @param {ExportDeclaration} statement
	 * @returns {IFormattedExport[]}
	 */
	public getExportsForStatement (statement: ExportDeclaration): IFormattedExport[] {
		return exportServiceGetter().getExportsForStatement(statement);
	}

	/**
	 * Gets all IFormattedExports for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedExport[]}
	 */
	public getExportsForStatements (statements: NodeArray<AstNode>): IFormattedExport[] {
		return exportServiceGetter().getExportsForStatements(statements);
	}

	/**
	 * Excludes files from the CodeAnalyzer that matches the provided Regular Expression(s)
	 * @param {RegExp | Iterable<RegExp>} match
	 */
	public excludeFiles (match: RegExp|Iterable<RegExp>): void {
		languageService.excludeFiles(match);
	}

	/**
	 * Gets all FormattedFunctions for the given file
	 * @param {string} file
	 * @param {string} [content]
	 * @returns {FormattedFunction[]}
	 */
	public getFunctionsForFile (file: string, content?: string): FormattedFunction[] {
		return functionServiceGetter().getFunctionsForFile(file, content);
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
	 * Resolves an expression from another one.
	 * @param {FormattedExpression} expression
	 * @returns {FormattedExpression}
	 */
	public getDefinitionMatchingExpression (expression: FormattedExpression): FormattedExpression|undefined {
		return resolverServiceGetter().getDefinitionMatchingExpression(expression);
	}

	/**
	 * Gets all IFormattedClasses for the given file
	 * @param {string} file
	 * @param {string} [content]
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForFile (file: string, content?: string): IFormattedClass[] {
		return classServiceGetter().getClassesForFile(file, content);
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
	 * @param {string} [content]
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForFile (file: string, content?: string): IFormattedInterfaceType[] {
		return interfaceTypeServiceGetter().getInterfacesForFile(file, content);
	}

	/**
	 * Gets all IInterfaceTypes for the given statement
	 * @param {InterfaceDeclaration} statement
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForStatement (statement: InterfaceDeclaration): IFormattedInterfaceType[] {
		return interfaceTypeServiceGetter().getInterfacesForStatement(statement);
	}

	/**
	 * Gets all IInterfaceTypes for the given Statements
	 * @param {NodeArray<Statement>} statements
	 * @returns {IFormattedInterfaceType[]}
	 */
	public getInterfacesForStatements (statements: NodeArray<Statement>): IFormattedInterfaceType[] {
		return interfaceTypeServiceGetter().getInterfacesForStatements(statements);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given file
	 * @param {string} file
	 * @param {string} [content]
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForFile (file: string, content?: string): IFormattedCallExpression[] {
		return callExpressionServiceGetter().getCallExpressionsForFile(file, content);
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
	 * @param {string} [content]
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForFile (file: string, match: string|RegExp, content?: string): IFormattedCallExpression[] {
		return callExpressionServiceGetter().findMatchingCallExpressionsForFile(file, match, content);
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
	 * @param {string} [content]
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForFile (file: string, content?: string): IFormattedIdentifier[] {
		return identifierExpressionServiceGetter().getIdentifiersForFile(file, content);
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