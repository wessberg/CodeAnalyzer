import {Expression, Node, Statement, SyntaxKind} from "typescript";
import {ICallExpressionGetter} from "./interface/ICallExpressionGetter";
import {ICallExpression, IdentifierMapKind} from "../identifier/interface/IIdentifier";
import {callExpressionFormatter, childStatementGetter, filePathUtil, identifierUtil, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isCallExpression, isExpressionStatement} from "../predicate/PredicateFunctions";

export class CallExpressionGetter implements ICallExpressionGetter {
	/**
	 * Gets and formats all CallExpressions associated with the given statements.
	 * These hold information such as the arguments the members are invoked with, generic type
	 * arguments and such.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ICallExpression[]}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): ICallExpression[] {
		const expressions: ICallExpression[] = [];

		statements.forEach(statement => {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) return;

			const actualStatement = deep || isCallExpression(statement) ? statement : isExpressionStatement(statement) && isCallExpression(statement.expression) ? statement.expression : statement;

			if (!statementUtil.isResolvingStatement(actualStatement)) {
				if (isCallExpression(actualStatement)) {
					statementUtil.setResolvingStatement(actualStatement);
					expressions.push(this.get(actualStatement));
					statementUtil.removeResolvingStatement(actualStatement);
				}
			}

			if (deep) {
				const otherCallExpressions = this.getForStatements(childStatementGetter.get(statement), deep);
				otherCallExpressions.forEach(exp => expressions.push(exp));
			}

		});
		return identifierUtil.setKind(expressions, IdentifierMapKind.CALL_EXPRESSIONS);
	}

	/**
	 * Gets and formats all CallExpressions associated with the given file.
	 * These hold information such as the arguments the members are invoked with, generic type
	 * arguments and such.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ICallExpression[]}
	 */
	public getForFile (fileName: string, deep: boolean = false): ICallExpression[] {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return [];

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getForStatements(statements, deep);
	}

	/**
	 * Formats the given Statement into an ICallExpression.
	 * @param {Statement|Expression} statement
	 * @returns {ICallExpression}
	 */
	public get (statement: Statement|Expression): ICallExpression {
		if (isCallExpression(statement)) {
			return callExpressionFormatter.format(statement);
		}

		throw new TypeError(`${this.constructor.name} could not format a CallExpression of kind ${SyntaxKind[statement.kind]}`);
	}
}