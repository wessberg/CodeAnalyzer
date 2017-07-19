import {IFunctionDeclarationGetter} from "./interface/IFunctionDeclarationGetter";
import {Expression, FunctionDeclaration, Node, Statement} from "typescript";
import {IdentifierMapKind, IFunctionDeclaration, IFunctionIndexer} from "../identifier/interface/IIdentifier";
import {cache, childStatementGetter, filePathUtil, functionFormatter, identifierUtil, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isFunctionDeclaration} from "../predicate/PredicateFunctions";

/**
 * A class that can get an IFunctionIndexer for a file, some Statements or a block of code.
 */
export class FunctionDeclarationGetter implements IFunctionDeclarationGetter {

	/**
	 * Gets all function declarations (if any) that occurs in the given file
	 * and returns them in a IFunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IFunctionIndexer}
	 */
	public getForFile (fileName: string, deep: boolean = false): IFunctionIndexer {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return {};

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
	 * and returns them in a IFunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IFunctionIndexer}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IFunctionIndexer {
		const functionIndexer: IFunctionIndexer = {};

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