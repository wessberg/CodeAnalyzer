import {INewExpressionGetter} from "./interface/INewExpressionGetter";
import {Expression, Node, Statement, SyntaxKind} from "typescript";
import {INewExpression} from "../identifier/interface/IIdentifier";
import {childStatementGetter, languageService, newExpressionFormatter, pathValidatorUtil, statementUtil} from "../services";
import {isExpressionStatement, isNewExpression} from "../predicate/PredicateFunctions";

export class NewExpressionGetter implements INewExpressionGetter {

	/**
	 * Gets and formats all NewExpressions associated with the given file.
	 * These hold information such as the arguments the constructor is invoked with, generic type
	 * arguments and such.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {INewExpression[]}
	 */
	public getForFile (fileName: string, deep: boolean = false): INewExpression[] {
		if (pathValidatorUtil.isBlacklisted(fileName)) return [];

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getForStatements(statements, deep);
	}

	/**
	 * Gets and formats all NewExpressions associated with the given statements.
	 * These hold information such as the arguments the constructor is invoked with, generic type
	 * arguments and such.
	 * @param {(Statement | Expression | Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {INewExpression[]}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): INewExpression[] {
		const expressions: INewExpression[] = [];

		statements.forEach(statement => {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) return;

			if (!statementUtil.isResolvingStatement(statement)) {
				if (isExpressionStatement(statement) && isNewExpression(statement.expression)) {
					statementUtil.setResolvingStatement(statement);
					expressions.push(this.get(statement.expression));
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherNewExpressions = this.getForStatements(childStatementGetter.get(statement), deep);
				otherNewExpressions.forEach(exp => expressions.push(exp));
			}

		});
		return expressions;
	}

	/**
	 * Formats the given Statement into an INewExpression.
	 * @param {Statement|Expression} statement
	 * @returns {INewExpression}
	 */
	public get (statement: Statement|Expression): INewExpression {
		if (isNewExpression(statement)) {
			return newExpressionFormatter.format(statement);
		}
		throw new TypeError(`${this.constructor.name} could not format a NewExpression of kind ${SyntaxKind[statement.kind]}`);
	}

}