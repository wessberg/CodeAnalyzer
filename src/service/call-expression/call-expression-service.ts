import {ICallExpressionService} from "./i-call-expression-service";
import {CallExpression, createNodeArray, ExpressionStatement, isCallExpression, isExpressionStatement, isIdentifier, isPropertyAccessExpression, NodeArray, SourceFile, SyntaxKind} from "typescript";
import {IPrinter, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";

/**
 * A class for working with classes
 */
export class CallExpressionService implements ICallExpressionService {

	constructor (private astUtil: ITypescriptASTUtil,
							 private printer: IPrinter) {
	}

	/**
	 * Gets the CallExpressions on PropertyAccessExpressions matching the provided identifier and property
	 * @param {string} identifier
	 * @param {string} property
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {NodeArray<CallExpression>}
	 */
	public getCallExpressionsOnPropertyAccessExpressionMatching (identifier: string, property: string|undefined, sourceFile: SourceFile, deep: boolean = true): NodeArray<CallExpression> {
		const filtered = this.getCallExpressions(sourceFile, deep);
		return createNodeArray(filtered.filter(callExpression => {
			if (!isPropertyAccessExpression(callExpression.expression)) return false;
			return isIdentifier(callExpression.expression.expression) && callExpression.expression.expression.text === identifier && property == null ? true : callExpression.expression.name.text === property;
		}));
	}

	/**
	 * Returns all CallExpressions where the base matches the provided Regular Expression
	 * @param {RegExp} match
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {NodeArray<CallExpression>}
	 */
	public getCallExpressionsMatching (match: RegExp, sourceFile: SourceFile, deep: boolean = true): NodeArray<CallExpression> {
		const filtered = this.getCallExpressions(sourceFile, deep);
		return createNodeArray(filtered.filter(callExpression => {
			return match.test(this.printer.print(callExpression.expression));
		}));
	}

	/**
	 * Gets all CallExpressions for the provided SourceFile
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {NodeArray<CallExpression>}
	 */
	public getCallExpressions (sourceFile: SourceFile, deep: boolean = true): NodeArray<CallExpression> {
		const match: NodeArray<CallExpression|ExpressionStatement> = this.astUtil.getFilteredStatements(sourceFile.statements, [SyntaxKind.CallExpression, SyntaxKind.ExpressionStatement], deep);

		// For all ExpressionStatements, check if their expressions are CallExpressions. If not, filter them out
		const filtered = match.filter(node => isExpressionStatement(node) ? isCallExpression(node.expression) : true);

		// Take all CallExpressions for all ExpressionStatements and otherwise return the CallExpressions
		return <NodeArray<CallExpression>> createNodeArray(filtered.map(node => isExpressionStatement(node) ? node.expression : node));
	}
}