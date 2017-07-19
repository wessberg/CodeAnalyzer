import {CallExpression, Expression, ImportDeclaration, ImportEqualsDeclaration, Node, Statement, VariableStatement} from "typescript";
import {IImportDeclarationGetter} from "./interface/IImportDeclarationGetter";
import {IdentifierMapKind, IImportDeclaration} from "../identifier/interface/IIdentifier";
import {cache, childStatementGetter, filePathUtil, identifierUtil, importFormatter, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isCallExpression, isExpressionStatement, isImportDeclaration, isImportEqualsDeclaration, isVariableStatement} from "../predicate/PredicateFunctions";

/**
 * A class that can get all IImportDeclarations for a file, some Statements or a block of code.
 */
export class ImportDeclarationGetter implements IImportDeclarationGetter {

	/**
	 * Gets and returns all ImportDeclarations (if any) that occur in the given file
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IImportDeclaration[]}
	 */
	public getForFile (fileName: string, deep: boolean = false): IImportDeclaration[] {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return [];

		const cached = cache.getCachedImportDeclarations(fileName);
		if (cached != null && !cache.cachedImportDeclarationsNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) return [];
		const declarations = this.getForStatements(statements, deep);

		cache.setCachedImportDeclarations(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets and returns all ImportDeclarations (if any) that occur in the given array of statements.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IImportDeclaration[]}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IImportDeclaration[] {
		const declarations: IImportDeclaration[] = [];
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (
				isImportDeclaration(statement) ||
				isImportEqualsDeclaration(statement) ||
				isVariableStatement(statement) ||
				isCallExpression(statement)
			) {
				if (!statementUtil.isResolvingStatement(statement)) {
					statementUtil.setResolvingStatement(statement);
					const declaration = this.get(statement);
					if (declaration != null) declarations.push(declaration);
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (isExpressionStatement(statement) && isCallExpression(statement.expression)) {
				if (!statementUtil.isResolvingStatement(statement.expression)) {
					statementUtil.setResolvingStatement(statement.expression);
					const declaration = this.get(statement.expression);
					if (declaration != null) declarations.push(declaration);
					statementUtil.removeResolvingStatement(statement.expression);
				}
			}

			if (deep) {
				const otherImportDeclarations = this.getForStatements(childStatementGetter.get(statement), deep);

				// TODO: How about duplicates?
				otherImportDeclarations.forEach(declaration => declarations.push(declaration));
			}
		}

		return identifierUtil.setKind(declarations, IdentifierMapKind.IMPORTS);
	}

	/**
	 * If given an ImportDeclaration|ImportEqualsDeclaration, a formatted IImportDeclaration will be returned holding the relative and full import-path
	 * as well as any bindings that will live in the local scope of the given file.
	 * @param {ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression} statement
	 * @returns {IImportDeclaration}
	 */
	public get (statement: ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression): IImportDeclaration|null {
		return importFormatter.format(statement);
	}

}