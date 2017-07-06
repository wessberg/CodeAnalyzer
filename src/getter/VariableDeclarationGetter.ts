import {Expression, Node, Statement, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {IVariableDeclarationGetter} from "./interface/IVariableDeclarationGetter";
import {IdentifierMapKind, VariableIndexer} from "../identifier/interface/IIdentifier";
import {cache, childStatementGetter, filePathUtil, identifierUtil, languageService, pathValidatorUtil, statementUtil, variableFormatter} from "../services";
import {isVariableDeclaration, isVariableDeclarationList, isVariableStatement} from "../predicate/PredicateFunctions";

export class VariableDeclarationGetter implements IVariableDeclarationGetter {

	/**
	 * Gets all variable assignments (if any) that occurs in the given file
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {VariableIndexer}
	 */
	public getForFile (fileName: string, deep: boolean = false): VariableIndexer {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return {};

		const cached = cache.getCachedVariableIndexer(fileName);
		if (cached != null && !cache.cachedVariableIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const assignments = this.getForStatements(statements, deep);
		cache.setCachedVariableIndexer(fileName, assignments);
		return assignments;
	}

	/**
	 * Gets all variable assignments (if any) that occurs in the given array of statements
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {VariableIndexer}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): VariableIndexer {
		const assignmentMap: VariableIndexer = {};

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (!statementUtil.isResolvingStatement(statement)) {
				if (isVariableStatement(statement) || isVariableDeclarationList(statement) || isVariableDeclaration(statement)) {
					statementUtil.setResolvingStatement(statement);
					Object.assign(assignmentMap, this.get(statement));
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherAssignments = this.getForStatements(childStatementGetter.get(statement), deep);
				Object.keys(otherAssignments).forEach(key => {
					// Only assign the deep variable to the assignmentMap if there isn't a match in the scope above it.
					if (assignmentMap[key] == null) Object.assign(assignmentMap, {[key]: otherAssignments[key]});
				});
			}
		}

		return identifierUtil.setKind(assignmentMap, IdentifierMapKind.VARIABLE_INDEXER);
	}

	/**
	 * Returns a formatted VariableIndexer.
	 * @param {VariableDeclaration|VariableDeclarationList|VariableStatement} statement
	 * @returns {VariableIndexer}
	 */
	public get (statement: VariableDeclaration|VariableDeclarationList|VariableStatement): VariableIndexer {
		return variableFormatter.format(statement);
	}

}