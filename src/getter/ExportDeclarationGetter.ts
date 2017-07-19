import {BinaryExpression, CallExpression, ClassDeclaration, ExportAssignment, ExportDeclaration, Expression, ExpressionStatement, FunctionDeclaration, Node, Statement, VariableStatement} from "typescript";
import {IExportDeclarationGetter} from "./interface/IExportDeclarationGetter";
import {IdentifierMapKind, IExportDeclaration} from "../identifier/interface/IIdentifier";
import {cache, childStatementGetter, exportFormatter, filePathUtil, identifierUtil, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isBinaryExpression, isCallExpression, isClassDeclaration, isExportAssignment, isExportDeclaration, isExpressionStatement, isFunctionDeclaration, isVariableStatement} from "../predicate/PredicateFunctions";

/**
 * A class that can get all IExportDeclarations for a file, some Statements or a block of code.
 */
export class ExportDeclarationGetter implements IExportDeclarationGetter {
	/**
	 * Gets all ExportDeclarations (if any) that occur in the given file and returns an array of IExportDeclarations
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getForFile (fileName: string, deep: boolean = false): IExportDeclaration[] {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return [];

		const cached = cache.getCachedExportDeclarations(fileName);
		if (cached != null && !cache.cachedExportDeclarationsNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) return [];
		const declarations = this.getForStatements(statements, deep);
		cache.setCachedExportDeclarations(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets all ExportDeclarations (if any) that occur in the given array of statements and returns an array
	 * of IExportDeclarations.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IExportDeclaration[] {
		const declarations: IExportDeclaration[] = [];

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (!statementUtil.isResolvingStatement(statement)) {
				if (
					isExportDeclaration(statement) ||
					isExportAssignment(statement) ||
					isVariableStatement(statement) ||
					isFunctionDeclaration(statement) ||
					isClassDeclaration(statement) ||
					isExpressionStatement(statement) ||
					isBinaryExpression(statement) ||
					isCallExpression(statement)
				) {
					statementUtil.setResolvingStatement(statement);
					const declaration = this.get(statement);
					if (declaration != null) declarations.push(declaration);
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherExportDeclarations = this.getForStatements(childStatementGetter.get(statement), deep);
				otherExportDeclarations.forEach(declaration => declarations.push(declaration));
			}
		}
		return identifierUtil.setKind(declarations, IdentifierMapKind.EXPORTS);
	}

	/**
	 * If given something that might be an export declaration, a formatted IExportDeclaration will be returned holding the relative and full export-path
	 * as well as any bindings that will live in the local scope of the given file.
	 * @param {ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|BinaryExpression|CallExpression} statement
	 * @returns {IExportDeclaration}
	 */
	public get (statement: ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|ExpressionStatement|BinaryExpression|CallExpression): IExportDeclaration|null {
		return exportFormatter.format(statement);
	}

}