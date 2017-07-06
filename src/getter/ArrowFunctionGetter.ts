import {IArrowFunctionGetter} from "./interface/IArrowFunctionGetter";
import {ArrowFunction, Expression, Node, Statement} from "typescript";
import {IArrowFunction, IdentifierMapKind} from "../identifier/interface/IIdentifier";
import {arrowFunctionFormatter, cache, childStatementGetter, identifierUtil, languageService, pathValidatorUtil, statementUtil} from "../services";
import {isArrowFunction} from "../predicate/PredicateFunctions";

export class ArrowFunctionGetter implements IArrowFunctionGetter {

	/**
	 * Gets and returns all ArrowFunctions (if any) that occur in the given file
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IArrowFunction[]}
	 */
	public getForFile (fileName: string, deep: boolean = false): IArrowFunction[] {
		if (pathValidatorUtil.isBlacklisted(fileName)) return [];

		const cached = cache.getCachedArrowFunctions(fileName);
		if (cached != null && !cache.cachedArrowFunctionsNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const functions = this.getForStatements(statements, deep);

		cache.setCachedArrowFunctions(fileName, functions);
		return functions;
	}

	/**
	 * Gets and returns all ArrowFunctions (if any) that occur in the given array of statements.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IArrowFunction[]}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IArrowFunction[] {
		const declarations: IArrowFunction[] = [];
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (statementUtil.shouldSkip(statement)) continue;

			if (
				isArrowFunction(statement)
			) {
				if (!statementUtil.isResolvingStatement(statement)) {
					statementUtil.setResolvingStatement(statement);
					const declaration = this.get(statement);
					if (declaration != null) declarations.push(declaration);
					statementUtil.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherArrowFunctions = this.getForStatements(childStatementGetter.get(statement), deep);
				otherArrowFunctions.forEach(declaration => declarations.push(declaration));
			}
		}

		return identifierUtil.setKind(declarations, IdentifierMapKind.ARROW_FUNCTIONS);
	}

	/**
	 * If given an ArrowFunction, a formatted IArrowFunction will be returned.
	 * @param {ArrowFunction} statement
	 * @returns {IArrowFunction}
	 */
	public get (statement: ArrowFunction): IArrowFunction {
		return arrowFunctionFormatter.format(statement);
	}

}