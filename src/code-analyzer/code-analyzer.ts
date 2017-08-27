import {ICodeAnalyzer} from "./i-code-analyzer";
import {IFormattedCallExpression, IFormattedClass, IFormattedIdentifier, IInterfaceType} from "@wessberg/type";
import {CallExpression, ClassDeclaration, ClassExpression, Identifier, InterfaceDeclaration, NodeArray, Statement} from "typescript";
import {callExpressionService, classService, identifierExpressionService, interfaceTypeService} from "../services";
import {AstNode} from "../type/ast-node/ast-node";

/**
 * A service that can analyze your code in great detail ahead of time.
 */
export class CodeAnalyzer implements ICodeAnalyzer {


	/**
	 * Gets all IFormattedClasses for the given file
	 * @param {string} file
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForFile (file: string): IFormattedClass[] {
		return classService.getClassesForFile(file);
	}

	/**
	 * Gets all IFormattedClass for the given statement
	 * @param {ClassExpression|ClassDeclaration} statement
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForStatement (statement: ClassExpression|ClassDeclaration): IFormattedClass[] {
		return classService.getClassesForStatement(statement);
	}

	/**
	 * Gets all IFormattedClass for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedClass[]}
	 */
	public getClassesForStatements (statements: NodeArray<AstNode>): IFormattedClass[] {
		return classService.getClassesForStatements(statements);
	}
	/**
	 * Gets all IInterfaceTypes for the given file
	 * @param {string} file
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForFile (file: string): IInterfaceType[] {
		return interfaceTypeService.getInterfacesForFile(file);
	}

	/**
	 * Gets all IInterfaceTypes for the given statement
	 * @param {InterfaceDeclaration} statement
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForStatement (statement: InterfaceDeclaration): IInterfaceType[] {
		return interfaceTypeService.getInterfacesForStatement(statement);
	}

	/**
	 * Gets all IInterfaceTypes for the given Statements
	 * @param {NodeArray<Statement>} statements
	 * @returns {IInterfaceType[]}
	 */
	public getInterfacesForStatements (statements: NodeArray<Statement>): IInterfaceType[] {
		return interfaceTypeService.getInterfacesForStatements(statements);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForFile (file: string): IFormattedCallExpression[] {
		return callExpressionService.getCallExpressionsForFile(file);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given statement
	 * @param {CallExpression} statement
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForStatement (statement: CallExpression): IFormattedCallExpression[] {
		return callExpressionService.getCallExpressionsForStatement(statement);
	}

	/**
	 * Gets all IFormattedCallExpressions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedCallExpression[]}
	 */
	public getCallExpressionsForStatements (statements: NodeArray<AstNode>): IFormattedCallExpression[] {
		return callExpressionService.getCallExpressionsForStatements(statements);
	}

	/**
	 * Finds all the call expressions in the provided file that matches the provided match which can be a string or a regular expression
	 * @param {string} file
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForFile (file: string, match: string|RegExp): IFormattedCallExpression[] {
		return callExpressionService.findMatchingCallExpressionsForFile(file, match);
	}

	/**
	 * Finds all the call expressions for the provided statement that matches the provided match which can be a string or a regular expression
	 * @param {ts.CallExpression} statement
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForStatement (statement: CallExpression, match: string|RegExp): IFormattedCallExpression[] {
		return callExpressionService.findMatchingCallExpressionsForStatement(statement, match);
	}

	/**
	 * Finds all the call expressions for the provided statements that matches the provided match which can be a string or a regular expression
	 * @param {ts.NodeArray<AstNode>} statements
	 * @param {string | RegExp} match
	 * @returns {IFormattedCallExpression[]}
	 */
	public findMatchingCallExpressionsForStatements (statements: NodeArray<AstNode>, match: string|RegExp): IFormattedCallExpression[] {
		return callExpressionService.findMatchingCallExpressionsForStatements(statements, match);
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given file
	 * @param {string} file
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForFile (file: string): IFormattedIdentifier[] {
		return identifierExpressionService.getIdentifiersForFile(file);
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given statement
	 * @param {Identifier} statement
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForStatement (statement: Identifier): IFormattedIdentifier[] {
		return identifierExpressionService.getIdentifiersForStatement(statement);
	}

	/**
	 * Gets all IFormattedIdentifierExpressions for the given Statements
	 * @param {NodeArray<AstNode>} statements
	 * @returns {IFormattedIdentifier[]}
	 */
	public getIdentifiersForStatements (statements: NodeArray<AstNode>): IFormattedIdentifier[] {
		return identifierExpressionService.getIdentifiersForStatements(statements);
	}
}