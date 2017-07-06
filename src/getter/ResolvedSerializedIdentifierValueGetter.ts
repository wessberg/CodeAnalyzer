import {IResolvedSerializedIdentifierValueGetter} from "./interface/IResolvedSerializedIdentifierValueGetter";
import {Expression, Node, Statement} from "typescript";
import {ArbitraryValue, IdentifierMapKind, ResolvedSerializedIIdentifierValueMap, ResolvedSerializedIIdentifierValueMapIndexer} from "../identifier/interface/IIdentifier";
import {cache, filePathUtil, identifierUtil, languageService, marshaller, pathValidatorUtil, resolvedIdentifierValueGetter, typeDetector} from "../services";

export class ResolvedSerializedIdentifierValueGetter implements IResolvedSerializedIdentifierValueGetter {

	/**
	 * Gets a map of all identifiers for the given file and their resolved serialized values.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedSerializedIIdentifierValueMap}
	 */
	public getForFile (fileName: string, deep: boolean = false): ResolvedSerializedIIdentifierValueMap {
		if (filePathUtil.isExcluded(fileName) || pathValidatorUtil.isBlacklisted(fileName)) return {___kind: IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP, map: {}};

		const cached = cache.getCachedResolvedSerializedIdentifierValueMap(fileName);
		if (cached != null && !cache.cachedResolvedSerializedIdentifierValueMapNeedsUpdate(fileName)) return cached.content;

		const statements = languageService.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.constructor.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);

		const declarations = this.getForStatements(statements, deep);
		cache.setCachedResolvedSerializedIdentifierValueMap(fileName, declarations);

		// TODO: Why any cast?
		return <any>declarations;
	}

	/**
	 * Gets a map of all identifiers for the given statements and their resolved serialized values.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedSerializedIIdentifierValueMap}
	 */
	public getForStatements (statements: (Statement|Expression|Node)[], deep: boolean = false): ResolvedSerializedIIdentifierValueMap {
		const map: ResolvedSerializedIIdentifierValueMapIndexer = {};
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

						const value = ctor[staticKey];
						mappedKeys[staticKey] = marshaller.marshal(value);
					});
					map[key] = mappedKeys;
					break;

				case "class":
					const ctorForClass = <{ [key: string]: ArbitraryValue }&Function>value;
					const staticKeysForClass = Object.getOwnPropertyNames(ctorForClass.constructor);

					const mappedKeysForClass: { [key: string]: string } = {};
					staticKeysForClass.forEach(staticKey => {
						const value = ctorForClass[staticKey];
						mappedKeysForClass[staticKey] = marshaller.marshal(value);
					});
					map[key] = mappedKeysForClass;
					break;
				default:
					map[key] = marshaller.marshal(value);
			}
		});

		const resolvedMap: ResolvedSerializedIIdentifierValueMap = {
			___kind: IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP,
			map
		};

		return identifierUtil.setKind(resolvedMap, IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP);
	}

	/**
	 * Gets a ResolvedSerializedIIdentifierValueMap for the given Statement.
	 * @param {Statement|Expression|Node} statement
	 * @returns {ResolvedSerializedIIdentifierValueMap}
	 */
	public get (statement: Statement|Expression|Node): ResolvedSerializedIIdentifierValueMap {
		return this.getForStatements([statement]);
	}

}