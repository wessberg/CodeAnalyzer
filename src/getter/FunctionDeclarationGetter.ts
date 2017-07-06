import {IFunctionDeclarationGetter} from "./interface/IFunctionDeclarationGetter";
import {Expression, FunctionDeclaration, Node, Statement} from "typescript";
import {FunctionIndexer, IdentifierMapKind, IFunctionDeclaration} from "../identifier/interface/IIdentifier";
import {cache, childStatementGetter, functionFormatter, identifierUtil, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isFunctionDeclaration} from "../predicate/PredicateFunctions";

export class FunctionDeclarationGetter implements IFunctionDeclarationGetter {

	/**
	 * Gets all function declarations (if any) that occurs in the given file
	 * and returns them in a FunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {FunctionIndexer}
	 */
	public getForFile (fileName: string, deep: boolean = false): FunctionIndexer {
		if (pathValidatorUtil.isBlacklisted(fileName)) return {};

		const cached = cache.getCachedFunctionIndexer(fileName);
		if (cached != null && !cache.cachedFunctionIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);

		const declarations = this.getForStatements(statements, deep);
		cache.setCachedFunctionIndexer(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets all function declarations (if any) that occurs in the given array of statements
	 * and returns them in a FunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {FunctionIndexer}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): FunctionIndexer {
		const functionIndexer: FunctionIndexer = {};

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (!statementUtil.isResolvingStatement(statement)) {
				if (isFunctionDeclaration(statement)) {
					statementUtil.setResolvingStatement(statement);
					const formatted = this.get(statement);
					Object.assign(functionIndexer, {[formatted.name]: formatted});
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherDeclarations = this.getForStatements(childStatementGetter.get(statement), deep);
				Object.keys(otherDeclarations).forEach(key => {
					// Only assign the deep function to the functionIndexer if there isn't a match in the scope above it.
					if (functionIndexer[key] == null) Object.assign(functionIndexer, {[key]: otherDeclarations[key]});
				});
			}

		}

		return identifierUtil.setKind(functionIndexer, IdentifierMapKind.FUNCTION_INDEXER);
	}

	/**
	 * Returns a formatted IFunctionDeclaration.
	 * @param {FunctionDeclaration} statement
	 * @returns {IFunctionDeclaration}
	 */
	public get (statement: FunctionDeclaration): IFunctionDeclaration {
		return functionFormatter.format(statement);
	}

}