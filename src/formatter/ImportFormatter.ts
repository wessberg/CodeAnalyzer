import {CallExpression, Identifier, ImportClause, ImportDeclaration, ImportEqualsDeclaration, SyntaxKind, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {IBindingIdentifier} from "../model/interface/IBindingIdentifier";
import {isArrayBindingPattern, isCallExpression, isExternalModuleReference, isIdentifierObject, isImportDeclaration, isImportEqualsDeclaration, isNamedImports, isNamespaceImport, isObjectBindingPattern, isOmittedExpression, isVariableDeclaration, isVariableDeclarationList, isVariableStatement} from "../predicate/PredicateFunctions";
import {IImportFormatter} from "./interface/IImportFormatter";
import {ModuleFormatter} from "./ModuleFormatter";
import {exportDeclarationGetter, identifierUtil, mapper, nameGetter, requireFormatter, sourceFilePropertiesGetter, tracer} from "../services";
import {IdentifierMapKind, IImportDeclaration, IImportExportIndexer, ImportExportKind, IRequire, ModuleDependencyKind, NAMESPACE_NAME} from "../identifier/interface/IIdentifier";

/**
 * A class that can format IImportDeclarations for all relevant kinds of statements.
 */
export class ImportFormatter extends ModuleFormatter implements IImportFormatter {

	/**
	 * Formats the given statement into an IImportDeclaration (if possible)
	 * @param {ImportDeclaration | ImportEqualsDeclaration | VariableStatement | CallExpression} statement
	 * @returns {IImportDeclaration|null}
	 */
	public format (statement: ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression): IImportDeclaration|null {
		if (isImportDeclaration(statement)) return this.formatImportDeclaration(statement);
		if (isImportEqualsDeclaration(statement)) return this.formatImportEqualsDeclaration(statement);
		if (isVariableStatement(statement)) return this.formatVariableStatement(statement);
		if (isVariableDeclaration(statement)) return this.formatVariableDeclaration(statement);
		if (isVariableDeclarationList(statement)) return this.formatVariableDeclarationList(statement);
		if (isCallExpression(statement)) return this.formatCallExpression(statement);

		throw new TypeError(`${ImportFormatter.constructor.name} could not get an IImportDeclaration for a statement of kind ${SyntaxKind[(<Identifier>statement).kind]}!`);
	}

	/**
	 * Formats the given ImportDeclaration into an IImportDeclaration.
	 * @param {ImportDeclaration} statement
	 * @returns {IImportDeclaration}
	 */
	private formatImportDeclaration (statement: ImportDeclaration): IImportDeclaration {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		const relativePath = () => {
			const path = <string>nameGetter.getNameOfMember(statement.moduleSpecifier, false, true);
			if (path.toString().length < 1) {
				throw new TypeError(`${ImportFormatter.constructor.name} detected an import with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
			}
			return path;
		};

		const fullPath = () => {
			const relative = relativePath();
			return this.formatFullPathFromRelative(filePath, relative);
		};

		const map: IImportDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.IMPORT,
			startsAt: statement.pos,
			endsAt: statement.end,
			moduleKind: ModuleDependencyKind.ES_MODULE,
			source: {
				relativePath,
				fullPath
			},
			filePath,
			bindings: statement.importClause == null ? {} : this.formatImportClause(statement.importClause, fullPath)
		}, IdentifierMapKind.IMPORT);

		mapper.set(map, statement);
		return map;
	}

	/**
	 * Formats the given ImportEqualsDeclaration into an IImportDeclaration
	 * @param {ImportEqualsDeclaration} statement
	 * @returns {IImportDeclaration}
	 */
	private formatImportEqualsDeclaration (statement: ImportEqualsDeclaration): IImportDeclaration {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		if (isExternalModuleReference(statement.moduleReference)) {
			const {startsAt, endsAt, fullPath, relativePath, payload} = <IRequire>requireFormatter.format(statement.moduleReference);

			const map: IImportDeclaration = identifierUtil.setKind({
				___kind: IdentifierMapKind.IMPORT,
				startsAt,
				endsAt,
				moduleKind: ModuleDependencyKind.IMPORT_REQUIRE,
				source: {
					relativePath,
					fullPath
				},
				filePath,
				bindings: {
					[statement.name.text]: {
						startsAt: statement.name.pos,
						endsAt: statement.name.end,
						name: statement.name.text,
						payload,
						kind: ImportExportKind.DEFAULT,
						___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING
					}
				}
			}, IdentifierMapKind.IMPORT);
			mapper.set(map.bindings[statement.name.text], statement);

			mapper.set(map, statement);
			return map;

		} else {
			if (!isIdentifierObject(statement.moduleReference)) {
				throw new TypeError(`${ImportFormatter.constructor.name} could not find the name for a module reference!`);
			}

			const source = <IBindingIdentifier>nameGetter.getNameOfMember(statement.moduleReference, false, false);
			const block = tracer.traceBlockScopeName(statement);
			const clojure = tracer.traceClojure(statement);

			const payload = () => {
				const obj = clojure == null ? {
					___kind: IdentifierMapKind.LITERAL,
					startsAt: statement.moduleReference.pos,
					endsAt: statement.moduleReference.end,
					value: () => [clojure]
				} : tracer.findNearestMatchingIdentifier(statement, block, source.toString(), clojure);
				mapper.set(obj, statement.moduleReference);
				return obj;
			};

			const map: IImportDeclaration = identifierUtil.setKind({
				___kind: IdentifierMapKind.IMPORT,
				startsAt: statement.pos,
				endsAt: statement.end,
				moduleKind: ModuleDependencyKind.IMPORT_REQUIRE,
				source,
				filePath,
				bindings: {
					[statement.name.text]: {
						startsAt: statement.name.pos,
						endsAt: statement.name.end,
						___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
						name: statement.name.text,
						payload,
						kind: ImportExportKind.DEFAULT
					}
				}
			}, IdentifierMapKind.IMPORT);
			mapper.set(map.bindings[statement.name.text], statement);

			mapper.set(map, statement);
			return map;
		}
	}

	/**
	 * Formats the given VariableStatement into an IImportDeclaration, if possible.
	 * @param {VariableStatement} statement
	 * @returns {IImportDeclaration|null}
	 */
	private formatVariableStatement (statement: VariableStatement): IImportDeclaration|null {
		return this.formatVariableDeclarationList(statement.declarationList);
	}

	/**
	 * Formats the given VariableDeclarationList into an IImportDeclaration, if possible.
	 * @param {VariableDeclarationList} statement
	 * @returns {IImportDeclaration|null}
	 */
	private formatVariableDeclarationList (statement: VariableDeclarationList): IImportDeclaration|null {
		for (const declaration of statement.declarations) {
			const formatted = this.formatVariableDeclaration(declaration);
			if (formatted != null) return formatted;
		}
		return null;
	}

	/**
	 * Formats the given VariableDeclaration into an IImportDeclaration, if possible.
	 * @param {VariableDeclaration} statement
	 * @returns {IImportDeclaration|null}
	 */
	private formatVariableDeclaration (statement: VariableDeclaration): IImportDeclaration|null {
		return this.formatCallExpression(statement);
	}

	/**
	 * Formats the given CallExpression into an IImportDeclaration, if possible.
	 * @param {CallExpression | VariableDeclaration} statement
	 * @returns {IImportDeclaration|null}
	 */
	private formatCallExpression (statement: CallExpression|VariableDeclaration): IImportDeclaration|null {
		const requireCall = requireFormatter.format(statement);
		if (requireCall == null) return null;
		const {startsAt, endsAt, relativePath, fullPath, filePath, payload} = requireCall;

		const bindings: IImportExportIndexer = {};
		const name: (string|undefined)[] = [];
		let kind: ImportExportKind;

		if (isCallExpression(statement)) {
			name.push(NAMESPACE_NAME);
			kind = ImportExportKind.NAMESPACE;
		} else {

			if (isObjectBindingPattern(statement.name)) {
				statement.name.elements.forEach(binding => {
					name.push(nameGetter.getName(binding));
					kind = ImportExportKind.NAMED;
				});
			}

			else if (isArrayBindingPattern(statement.name)) {
				statement.name.elements.forEach((binding) => {
					if (isOmittedExpression(binding)) name.push(undefined);
					name.push(nameGetter.getName(binding));
					kind = ImportExportKind.NAMED;
				});
			}

			else {
				name.push(<string>nameGetter.getNameOfMember(statement.name, false, true));
				kind = ImportExportKind.NAMESPACE;
			}
		}

		name.forEach(part => {
			// TODO: Respect ArrayBindingPatterns or ObjectBindingPatterns.
			if (part == null) return;

			bindings[part] = {
				startsAt: requireCall.arguments.startsAt,
				endsAt: requireCall.arguments.endsAt,
				___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
				name: part,
				payload,
				kind
			};
			mapper.set(bindings[part], statement);
		});

		const map: IImportDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.IMPORT,
			startsAt,
			endsAt,
			moduleKind: ModuleDependencyKind.REQUIRE,
			source: {
				relativePath,
				fullPath
			},
			filePath,
			bindings
		}, IdentifierMapKind.IMPORT);

		mapper.set(map, statement);
		return map;
	}

	/**
	 * formats the given ImportClause and returns an ImportIndexer.
	 * @param {ImportClause} clause
	 * @param {string} modulePath
	 * @returns {IImportExportIndexer}
	 */
	private formatImportClause (clause: ImportClause, modulePath: () => string): IImportExportIndexer {
		const indexer: IImportExportIndexer = {};

		const namedBindings = clause.namedBindings;
		if (namedBindings != null && isNamespaceImport(namedBindings)) {
			const payload = () => {
				const path = modulePath();
				const obj = {
					___kind: IdentifierMapKind.LITERAL,
					startsAt: namedBindings.pos,
					endsAt: namedBindings.end,
					value: () => [this.moduleToNamespacedObjectLiteral(exportDeclarationGetter.getForFile(path, true))]
				};
				mapper.set(obj, namedBindings);
				return obj;
			};

			indexer[namedBindings.name.text] = {
				startsAt: namedBindings.name.pos,
				endsAt: namedBindings.name.end,
				___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
				name: namedBindings.name.text,
				payload,
				kind: ImportExportKind.NAMESPACE
			};
			mapper.set(indexer[namedBindings.name.text], namedBindings);
		}

		else if (namedBindings != null && isNamedImports(namedBindings)) {
			namedBindings.elements.forEach(element => {
				const block = tracer.traceBlockScopeName(clause);
				const payload = () => {
					const path = modulePath();
					const clojure = tracer.traceClojure(path);
					const obj = clojure == null ? {
						___kind: IdentifierMapKind.LITERAL,
						startsAt: element.pos,
						endsAt: element.end,
						value: () => [path]
					} : tracer.findNearestMatchingIdentifier(element, block, element.name.text, clojure);
					mapper.set(obj, element);
					return obj;
				};

				indexer[element.name.text] = {
					startsAt: element.name.pos,
					endsAt: element.name.end,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
					name: element.name.text,
					payload,
					kind: ImportExportKind.NAMED
				};
				mapper.set(indexer[element.name.text], element);
			});
		}

		if (clause.name != null) {
			const payload = () => {
				const path = modulePath();
				const fileExports = exportDeclarationGetter.getForFile(path, true);
				const match = fileExports.find(exportDeclaration => exportDeclaration.bindings.default != null);
				if (match == null) throw new ReferenceError(`${this.formatImportClause.name} could not extract a default export from ${path}! The module doesn't contain a default export.`);
				return match.bindings.default.payload();
			};

			indexer[clause.name.text] = {
				startsAt: clause.name.pos,
				endsAt: clause.name.end,
				___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
				name: clause.name.text,
				payload,
				kind: ImportExportKind.DEFAULT
			};
		}

		return indexer;
	}

}