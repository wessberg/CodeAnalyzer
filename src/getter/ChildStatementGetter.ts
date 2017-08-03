import {Declaration, Expression, Node, Statement, SyntaxKind} from "typescript";
import {IChildStatementGetter} from "./interface/IChildStatementGetter";
import {isArrayLiteralExpression, isArrowFunction, isAwaitExpression, isBinaryExpression, isBlockDeclaration, isBreakStatement, isCallExpression, isCaseBlock, isCaseClause, isClassDeclaration, isClassExpression, isConditionalExpression, isConstructorDeclaration, isContinueStatement, isDefaultClause, isDeleteExpression, isDoStatement, isElementAccessExpression, isEmptyStatement, isEnumDeclaration, isExportAssignment, isExportDeclaration, isExpressionStatement, isFalseKeyword, isFirstLiteralToken, isFirstNode, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isGetAccessorDeclaration, isIdentifierObject, isIfStatement, isImportDeclaration, isImportEqualsDeclaration, isImportExpression, isLabeledStatement, isLastTypeNode, isLiteralToken, isMethodDeclaration, isNewExpression, isNonNullExpression, isNullKeyword, isNumericLiteral, isObjectLiteralExpression, isParameterDeclaration, isParenthesizedExpression, isPostfixUnaryExpression, isPrefixUnaryExpression, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isRegularExpressionLiteral, isReturnStatement, isSetAccessorDeclaration, isShorthandPropertyAssignment, isSpreadAssignment, isSpreadElement, isStringLiteral, isSuperExpression, isSwitchStatement, isTemplateExpression, isTemplateToken, isThisKeyword, isThrowStatement, isTrueKeyword, isTryStatement, isTypeAliasDeclaration, isTypeAssertionExpression, isTypeOfExpression, isUndefinedKeyword, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isVoidExpression, isWhileStatement} from "../predicate/PredicateFunctions";
import {sourceFilePropertiesGetter, statementUtil} from "../services";

/**
 * A class that can find all statements that is "children" of any other Statement. This is relevant when "deep" parsing the AST. Then, we want to know which possible ways to go "down" the AST.
 */
export class ChildStatementGetter implements IChildStatementGetter {
	/**
	 * Finds all "children" of the given statement, if it has any.
	 * @param {Statement|Expression} statement
	 * @returns {(Statement|Declaration|Expression|Node)[]}
	 */
	public get (statement: Statement|Expression|Declaration|Node): (Statement|Declaration|Expression|Node)[] {
		// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
		if (statementUtil.shouldSkip(statement)) return [];

		if (isIfStatement(statement)) {

			const thenChildren = statement.thenStatement == null ? [] : [statement.thenStatement];
			const elseChildren = statement.elseStatement == null ? [] : [statement.elseStatement];
			return [statement.expression, ...thenChildren, ...elseChildren];
		}

		if (isShorthandPropertyAssignment(statement)) {
			return statement.objectAssignmentInitializer == null ? [] : [statement.objectAssignmentInitializer];
		}

		if (isDefaultClause(statement) || isCaseClause(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = isCaseClause(statement) ? [statement.expression] : [];
			statement.statements.forEach(child => statements.push(child));
			return statements;
		}

		if (isWhileStatement(statement)) {
			return [statement.expression, statement.statement];
		}

		if (isLabeledStatement(statement)) {
			return [statement.statement];
		}

		if (isExportAssignment(statement)) {
			return [statement.expression];
		}

		if (isExportDeclaration(statement)) {
			return statement.moduleSpecifier == null ? [] : [statement.moduleSpecifier];
		}

		if (isParenthesizedExpression(statement)) {
			return [statement.expression];
		}

		if (isCaseBlock(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.clauses.forEach(clause => statements.push(clause));

			return statements;
		}

		if (isAwaitExpression(statement)) {
			return [statement.expression];
		}

		if (isSwitchStatement(statement)) {
			return [statement.expression, statement.caseBlock];
		}

		if (isBlockDeclaration(statement)) {
			return statement.statements;
		}

		if (isReturnStatement(statement)) {
			return statement.expression == null ? [] : [statement.expression];
		}

		if (isArrowFunction(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isLabeledStatement(statement)) {
			return [statement.statement];
		}

		if (isConditionalExpression(statement)) {
			const whenTrue = statement.whenTrue == null ? [] : [statement.whenTrue];
			const whenFalse = statement.whenFalse == null ? [] : [statement.whenFalse];
			return [statement.condition, ...whenTrue, ...whenFalse];
		}

		if (isBinaryExpression(statement) || isFirstNode(statement)) {
			return [statement.left, statement.right];
		}

		if (isFunctionDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isExpressionStatement(statement)) {
			return [statement.expression];
		}

		if (isTryStatement(statement)) {

			const catchClause = statement.catchClause == null ? [] : [statement.catchClause.block];
			const finallyBlock = statement.finallyBlock == null ? [] : [statement.finallyBlock];

			return [statement.tryBlock, ...catchClause, ...finallyBlock];
		}

		if (isSpreadAssignment(statement) || isSpreadElement(statement)) {
			return [statement.expression];
		}

		if (isVariableStatement(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];

			statement.declarationList.declarations.forEach(declaration => statements.push(declaration));
			return statements;
		}

		if (isVariableDeclarationList(statement)) {
			const list: Declaration[] = [];
			statement.declarations.forEach(declaration => list.push(declaration));
			return list;
		}

		if (isVariableDeclaration(statement)) {
			return statement.initializer == null ? [] : [statement.initializer];
		}

		if (isElementAccessExpression(statement)) {
			return [statement.expression];
		}

		if (isPropertyAccessExpression(statement)) {
			return [statement.expression];
		}

		if (isPrefixUnaryExpression(statement)) {
			return [statement.operand];
		}

		if (isPostfixUnaryExpression(statement)) {
			return [statement.operand];
		}

		if (isFunctionExpression(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isTypeOfExpression(statement)) {
			return [statement.expression];
		}

		if (isMethodDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isGetAccessorDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isSetAccessorDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isTemplateExpression(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			if (statement.templateSpans == null) return [];
			statement.templateSpans.forEach(span => statements.push(span.expression));

			return statements;
		}

		if (isObjectLiteralExpression(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.properties.forEach(property => statements.push(property));

			return statements;
		}

		if (isPropertyAssignment(statement)) {
			return [statement.initializer];
		}

		if (isConstructorDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isArrayLiteralExpression(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.elements.forEach(element => statements.push(element));

			return statements;
		}

		if (isPropertyDeclaration(statement)) {
			return statement.initializer == null ? [] : [statement.initializer];
		}

		if (isClassExpression(statement) || isClassDeclaration(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.members.forEach(member => statements.push(member));

			return statements;
		}

		if (isForStatement(statement)) {
			const condition = statement.condition == null ? [] : [statement.condition];
			const incrementor = statement.incrementor == null ? [] : [statement.incrementor];
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			const body = statement.statement == null ? [] : [statement.statement];
			return [...condition, ...incrementor, ...initializer, ...body];
		}

		if (isForInStatement(statement)) {
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			const expression = statement.expression == null ? [] : [statement.expression];
			const body = statement.statement == null ? [] : [statement.statement];
			return [...expression, ...initializer, ...body];
		}

		if (isForOfStatement(statement)) {
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			const expression = statement.expression == null ? [] : [statement.expression];
			const body = statement.statement == null ? [] : [statement.statement];
			return [...expression, ...initializer, ...body];
		}

		if (isParameterDeclaration(statement)) {
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			return [...initializer];
		}

		if (isTypeAssertionExpression(statement)) {
			return [statement.expression];
		}

		if (isDoStatement(statement)) {
			return [statement.expression];
		}

		if (isCallExpression(statement)) {
			return [...statement.arguments, statement.expression];
		}

		if (isNonNullExpression(statement)) {
			return [statement.expression];
		}

		if (isEnumDeclaration(statement)) {
			return [];
		}

		if (isImportDeclaration(statement)) {
			return [];
		}

		if (isImportEqualsDeclaration(statement)) {
			return [];
		}

		if (isEmptyStatement(statement)) {
			return [];
		}

		if (isLastTypeNode(statement)) {
			return [];
		}

		if (isDeleteExpression(statement)) {
			return [];
		}

		if (isThisKeyword(statement)) {
			return [];
		}

		if (isBreakStatement(statement)) {
			return [];
		}

		if (isThrowStatement(statement)) {
			return [];
		}

		if (isContinueStatement(statement)) {
			return [];
		}

		if (isNewExpression(statement)) {
			return [];
		}

		if (isNullKeyword(statement)) {
			return [];
		}

		if (isUndefinedKeyword(statement)) {
			return [];
		}

		if (isIdentifierObject(statement)) {
			return [];
		}

		if (isRegularExpressionLiteral(statement)) {
			return [];
		}

		if (isVoidExpression(statement)) {
			return [];
		}

		if (isTypeAliasDeclaration(statement)) {
			return [];
		}

		if (isStringLiteral(statement)) {
			return [];
		}

		if (isNumericLiteral(statement)) {
			return [];
		}

		if (isFirstLiteralToken(statement)) {
			return [];
		}

		if (isTrueKeyword(statement)) {
			return [];
		}

		if (isFalseKeyword(statement)) {
			return [];
		}

		if (isLiteralToken(statement)) {
			return [];
		}

		if (isSuperExpression(statement)) {
			return [];
		}

		if (isImportExpression(statement)) {
			return [];
		}

		if (isTemplateToken(statement)) {
			return [];
		}

		throw new TypeError(`${this.constructor.name} could not find child statements for a statement of kind ${SyntaxKind[statement.kind]} around here: ${sourceFilePropertiesGetter.getSourceFileProperties(statement).fileContents.slice(statement.pos, statement.end)}`);
		// return [];
	}
}