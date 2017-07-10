import {IResolvedIdentifierValueGetter} from "./interface/IResolvedIdentifierValueGetter";
import {Expression, Node, Statement} from "typescript";
import {IdentifierMapKind, IResolvedIIdentifierValueMap, IResolvedIIdentifierValueMapIndexer} from "../identifier/interface/IIdentifier";
import {cache, classDeclarationGetter, enumDeclarationGetter, filePathUtil, functionDeclarationGetter, identifierUtil, importDeclarationGetter, languageService, pathValidatorUtil, variableDeclarationGetter} from "../services";
import {isIEnumDeclaration, isIExportableIIdentifier, isILiteralValue} from "../predicate/PredicateFunctions";

export class ResolvedIdentifierValueGetter implements IResolvedIdentifierValueGetter {

	/**
	 * Gets a map of all identifiers for the given file and their resolved values.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IResolvedIIdentifierValueMap}
	 */
	public getForFile (fileName: string, deep: boolean = false): IResolvedIIdentifierValueMap {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return {___kind: IdentifierMapKind.RESOLVED_IDENTIFIER_VALUE_MAP, map: {}};

		const cached = cache.getCachedResolvedIdentifierValueMap(fileName);
		if (cached != null && !cache.cachedResolvedIdentifierValueMapNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);

		const declarations = this.getForStatements(statements, deep);

		// TODO: Why any cast?
		cache.setCachedResolvedIdentifierValueMap(fileName, <any>declarations);

		// TODO: Why any cast?
		return <any>declarations;
	}

	/**
	 * Gets a map of all identifiers for the given statements and their resolved values.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IResolvedIIdentifierValueMap}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IResolvedIIdentifierValueMap {
		const map: IResolvedIIdentifierValueMapIndexer = {};

		const enums = enumDeclarationGetter.getForStatements(statements, deep);
		const variables = variableDeclarationGetter.getForStatements(statements, deep);
		const classes = classDeclarationGetter.getForStatements(statements, deep);
		const functions = functionDeclarationGetter.getForStatements(statements, deep);
		const imports = importDeclarationGetter.getForStatements(statements, deep);
		Object.keys(enums).forEach(name => map[name] = enums[name].members);
		Object.keys(variables).forEach(name => map[name] = variables[name].value.resolve());
		Object.keys(classes).forEach(name => map[name] = classes[name].value.resolve());
		Object.keys(functions).forEach(name => map[name] = functions[name].value.resolve());

		imports.forEach(importDeclaration => {
			Object.keys(importDeclaration.bindings).forEach(name => {
				const payload = importDeclaration.bindings[name].payload();

				if (isIExportableIIdentifier(payload)) {
					if (isIEnumDeclaration(payload)) map[name] = payload.members;
					else if (isILiteralValue(payload)) {
						map[name] = payload.value();
					}
					else {
						map[name] = payload.value.resolve();
					}
				}
			});
		});
		const resolvedMap: IResolvedIIdentifierValueMap = {
			___kind: IdentifierMapKind.RESOLVED_IDENTIFIER_VALUE_MAP,
			map
		};

		return identifierUtil.setKind(resolvedMap, IdentifierMapKind.RESOLVED_IDENTIFIER_VALUE_MAP);
	}

	/**
	 * Gets a IResolvedIIdentifierValueMap for the given Statement.
	 * @param {Statement|Expression|Node} statement
	 * @returns {IResolvedIIdentifierValueMap}
	 */
	public get (statement: Statement|Expression|Node): IResolvedIIdentifierValueMap {
		return this.getForStatements([statement]);
	}

}