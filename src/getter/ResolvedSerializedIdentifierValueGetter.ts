import {IResolvedSerializedIdentifierValueGetter} from "./interface/IResolvedSerializedIdentifierValueGetter";
import {Expression, Node, Statement} from "typescript";
import {ArbitraryValue, IdentifierMapKind, IResolvedSerializedIIdentifierValueMap, IResolvedSerializedIIdentifierValueMapIndexer} from "../identifier/interface/IIdentifier";
import {cache, filePathUtil, identifierUtil, languageService, marshaller, pathValidatorUtil, resolvedIdentifierValueGetter, typeDetector} from "../services";

/**
 * A class that can get an IResolvedSerializedIdentifierValueMap for a file, some Statements or a block of code.
 */
export class ResolvedSerializedIdentifierValueGetter implements IResolvedSerializedIdentifierValueGetter {

	/**
	 * Gets a map of all identifiers for the given file and their resolved serialized values.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IResolvedSerializedIIdentifierValueMap}
	 */
	public getForFile (fileName: string, deep: boolean = false): IResolvedSerializedIIdentifierValueMap {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return {___kind: IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP, map: {}};

		const cached = cache.getCachedResolvedSerializedIdentifierValueMap(fileName);
		if (cached != null && !cache.cachedResolvedSerializedIdentifierValueMapNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);

		const declarations = this.getForStatements(statements, deep);
		cache.setCachedResolvedSerializedIdentifierValueMap(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets a map of all identifiers for the given statements and their resolved serialized values.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IResolvedSerializedIIdentifierValueMap}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): IResolvedSerializedIIdentifierValueMap {
		const map: IResolvedSerializedIIdentifierValueMapIndexer = {};
		const unserialized = resolvedIdentifierValueGetter.getForStatements(statements, deep);

		Object.keys(unserialized.map).forEach(key => {
			const value = unserialized.map[key];
			const type = typeDetector.getTypeof(value);

			switch (type) {
				case "object":
					map[key] = marshaller.marshal(value);
					break;

				case "constructor":
					const ctor = <{ [key: string]: ArbitraryValue }&Function>value;
					const staticKeys = Object.getOwnPropertyNames(ctor);

					const mappedKeys: { [key: string]: string } = {};
					staticKeys.forEach(staticKey => {
						if (staticKey === "length" || staticKey === "prototype") return;
						mappedKeys[staticKey] = marshaller.marshal(ctor[staticKey]);
					});
					map[key] = mappedKeys;
					break;

				case "class":
					const ctorForClass = <{ [key: string]: ArbitraryValue }&Function>value;
					const staticKeysForClass = Object.getOwnPropertyNames(ctorForClass.constructor);

					const mappedKeysForClass: { [key: string]: string } = {};
					staticKeysForClass.forEach(staticKey => {
						mappedKeysForClass[staticKey] = marshaller.marshal(ctorForClass[staticKey]);
					});
					map[key] = mappedKeysForClass;
					break;
				default:
					map[key] = marshaller.marshal(value);
			}
		});

		const resolvedMap: IResolvedSerializedIIdentifierValueMap = {
			___kind: IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP,
			map
		};

		return identifierUtil.setKind(resolvedMap, IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP);
	}

	/**
	 * Gets a IResolvedSerializedIIdentifierValueMap for the given Statement.
	 * @param {Statement|Expression|Node} statement
	 * @returns {IResolvedSerializedIIdentifierValueMap}
	 */
	public get (statement: Statement|Expression|Node): IResolvedSerializedIIdentifierValueMap {
		return this.getForStatements([statement]);
	}

}