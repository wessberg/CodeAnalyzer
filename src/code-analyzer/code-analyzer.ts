import {ICodeAnalyzer} from "./i-code-analyzer";
import {IInterfaceType} from "@wessberg/type";
import {CallExpression, InterfaceDeclaration, NodeArray, Statement} from "typescript";
import {callExpressionService, interfaceTypeService} from "../services";
import {IFormattedCallExpression} from "../formatter/expression/call-expression/i-formatted-call-expression";
import {AstNode} from "../type/ast-node";

/**
 * A service that can analyze your code in great detail ahead of time.
 */
export class CodeAnalyzer implements ICodeAnalyzer {
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
}