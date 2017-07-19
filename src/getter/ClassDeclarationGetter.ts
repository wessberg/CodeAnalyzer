import {ClassDeclaration, Expression, Node, Statement} from "typescript";
import {IClassDeclarationGetter} from "./interface/IClassDeclarationGetter";
import {IClassDeclaration, IClassIndexer, IdentifierMapKind} from "../identifier/interface/IIdentifier";
import {cache, childStatementGetter, classFormatter, filePathUtil, identifierUtil, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isClassDeclaration} from "../predicate/PredicateFunctions";

/**
 * A class that can get a ClassIndexer for a file, some Statements or a block of code.
 */
export class ClassDeclarationGetter implements IClassDeclarationGetter {
	/**
	 * Gets all class declarations (if any) that occurs in the given file
	 * and returns them as a IClassIndexer.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IClassIndexer}
	 */
	public getForFile (fileName: string, deep: boolean = false): IClassIndexer {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return {};

		const cached = cache.getCachedClassIndexer(fileName);
		if (cached != null && !cache.cachedClassIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) return {};
		const declarations = this.getForStatements(statements, deep);

		Object.keys(declarations).forEach(key => cache.setCachedClass(fileName, declarations[key]));

		cache.setCachedClassIndexer(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets all class declarations (if any) that occurs in the given array of statements
	 * and returns them as a IClassIndexer.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IClassIndexer}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IClassIndexer {
		const declarations: IClassIndexer = {};
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (!statementUtil.isResolvingStatement(statement)) {
				if (isClassDeclaration(statement)) {
					statementUtil.setResolvingStatement(statement);
					const declaration = this.get(statement);
					declarations[declaration.name] = declaration;
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherDeclarations = this.getForStatements(childStatementGetter.get(statement), deep);
				Object.keys(otherDeclarations).forEach(key => {
					// Only assign the deep class to the declarations if there isn't a match in the scope above it.
					if (declarations[key] == null) Object.assign(declarations, {[key]: otherDeclarations[key]});
				});
			}
		}

		return identifierUtil.setKind(declarations, IdentifierMapKind.CLASS_INDEXER);
	}

	/**
	 * Gets a class declaration, including its methods, positions, which class it derives from,
	 * props and constructor parameters.
	 * @param {ClassDeclaration} statement
	 * @returns {IClassDeclaration}
	 */
	public get (statement: ClassDeclaration): IClassDeclaration {
		return classFormatter.format(statement);
	}

}