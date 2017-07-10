import {EnumDeclaration, Expression, Node, Statement} from "typescript";
import {IEnumDeclarationGetter} from "./interface/IEnumDeclarationGetter";
import {IdentifierMapKind, IEnumDeclaration, IEnumIndexer} from "../identifier/interface/IIdentifier";
import {cache, childStatementGetter, enumFormatter, filePathUtil, identifierUtil, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isEnumDeclaration} from "../predicate/PredicateFunctions";

export class EnumDeclarationGetter implements IEnumDeclarationGetter {

	/**
	 * Gets all enum declarations (if any) that occurs in the given file
	 * and returns them in a IEnumIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IEnumIndexer}
	 */
	public getForFile (fileName: string, deep: boolean = false): IEnumIndexer {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return {};

		const cached = cache.getCachedEnumIndexer(fileName);
		if (cached != null && !cache.cachedEnumIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const declarations = this.getForStatements(statements, deep);

		cache.setCachedEnumIndexer(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets all enum declarations (if any) that occurs in the given array of statements
	 * and returns them in a IEnumIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IEnumIndexer}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IEnumIndexer {
		const enumIndexer: IEnumIndexer = {};

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (!statementUtil.isResolvingStatement(statement)) {
				if (isEnumDeclaration(statement)) {
					statementUtil.setResolvingStatement(statement);
					const formatted = this.get(statement);
					Object.assign(enumIndexer, {[formatted.name]: formatted});
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherDeclarations = this.getForStatements(childStatementGetter.get(statement), deep);
				Object.keys(otherDeclarations).forEach(key => {
					// Only assign the deep declaration to the enumIndexer if there isn't a match in the scope above it.
					if (enumIndexer[key] == null) Object.assign(enumIndexer, {[key]: otherDeclarations[key]});
				});
			}

		}

		return identifierUtil.setKind(enumIndexer, IdentifierMapKind.ENUM_INDEXER);
	}

	/**
	 * Returns a formatted IEnumDeclaration.
	 * @param {EnumDeclaration} statement
	 * @returns {IEnumDeclaration}
	 */
	public get (statement: EnumDeclaration): IEnumDeclaration {
		return enumFormatter.format(statement);
	}

}