import {IAllIdentifiersGetter} from "./interface/IAllIdentifiersGetter";
import {Expression, Node, Statement} from "typescript";
import {IdentifierMapKind, IIdentifierMap} from "../identifier/interface/IIdentifier";
import {arrowFunctionGetter, cache, callExpressionGetter, classDeclarationGetter, enumDeclarationGetter, exportDeclarationGetter, filePathUtil, functionDeclarationGetter, identifierUtil, importDeclarationGetter, languageService, mutationGetter, pathValidatorUtil, variableDeclarationGetter} from "../services";

export class AllIdentifiersGetter implements IAllIdentifiersGetter {

	/**
	 * Gets all identifiers (such as variables, functions, classes, enums, imports, exports, etc) (if any) that occurs in the given file
	 * and returns them in a IVariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IIdentifierMap}
	 */
	public getForFile (fileName: string, deep: boolean = false): IIdentifierMap {

		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) {
			return {___kind: IdentifierMapKind.IDENTIFIER_MAP, enums: {}, classes: {}, variables: {}, functions: {}, callExpressions: [], imports: [], exports: [], mutations: [], arrowFunctions: []};
		}

		const cached = cache.getCachedIdentifierMap(fileName);
		if (cached != null && !cache.cachedIdentifierMapNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const map = this.getForStatements(statements, deep);
		cache.setCachedIdentifierMap(fileName, map);
		return map;
	}

	/**
	 * Gets all identifiers (such as variables, functions, classes, enums, imports, exports, etc) (if any) that occurs in the given array of statements
	 * and returns them in a IIdentifierMap. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IIdentifierMap}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IIdentifierMap {
		return identifierUtil.setKind({
			___kind: IdentifierMapKind.IDENTIFIER_MAP,
			enums: enumDeclarationGetter.getForStatements(statements, deep),
			variables: variableDeclarationGetter.getForStatements(statements, deep),
			classes: classDeclarationGetter.getForStatements(statements, deep),
			functions: functionDeclarationGetter.getForStatements(statements, deep),
			imports: importDeclarationGetter.getForStatements(statements, deep),
			exports: exportDeclarationGetter.getForStatements(statements, deep),
			callExpressions: callExpressionGetter.getForStatements(statements, deep),
			mutations: mutationGetter.getForStatements(statements, deep),
			arrowFunctions: arrowFunctionGetter.getForStatements(statements, deep)
		}, IdentifierMapKind.IDENTIFIER_MAP);
	}

	/**
	 * Gets a IIdentifierMap for the given Statement.
	 * @param {Statement|Expression|Node} statement
	 * @returns {IIdentifierMap}
	 */
	public get (statement: Statement|Expression|Node): IIdentifierMap {
		return this.getForStatements([statement]);
	}

}