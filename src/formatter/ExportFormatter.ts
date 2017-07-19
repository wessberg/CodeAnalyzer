import {BinaryExpression, CallExpression, ClassDeclaration, ExportAssignment, ExportDeclaration, ExpressionStatement, FunctionDeclaration, NamedExports, SyntaxKind, VariableStatement} from "typescript";
import {isBinaryExpression, isCallExpression, isClassDeclaration, isExportAssignment, isExportDeclaration, isExpressionStatement, isFunctionDeclaration, isLiteralExpression, isVariableStatement} from "../predicate/PredicateFunctions";
import {IExportFormatter} from "./interface/IExportFormatter";
import {ModuleFormatter} from "./ModuleFormatter";
import {callExpressionFormatter, classFormatter, exportDeclarationGetter, functionFormatter, identifierUtil, mapper, mutationFormatter, nameGetter, requireFormatter, sourceFilePropertiesGetter, tracer, valueableFormatter, variableFormatter} from "../services";
import {IdentifierMapKind, IExportDeclaration, IImportExportIndexer, ImportExportKind, IRequire, ModuleDependencyKind, NAMESPACE_NAME} from "../identifier/interface/IIdentifier";

/**
 * A class that can format IExportDeclarations for all relevant kinds of statements.
 */
export class ExportFormatter extends ModuleFormatter implements IExportFormatter {

	/**
	 * Formats the given statement into an IExportDeclaration, if possible.
	 * @param {ExportDeclaration | VariableStatement | ExportAssignment | FunctionDeclaration | ClassDeclaration | ExpressionStatement | BinaryExpression | CallExpression} statement
	 * @returns {IExportDeclaration|null}
	 */
	public format (statement: ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|ExpressionStatement|BinaryExpression|CallExpression): IExportDeclaration|null {

		if (isExpressionStatement(statement)) {
			if (
				isCallExpression(statement.expression) ||
				isBinaryExpression(statement.expression) ||
				isExportAssignment(statement.expression) ||
				isClassDeclaration(statement.expression) ||
				isFunctionDeclaration(statement.expression) ||
				isVariableStatement(statement.expression) ||
				isExportDeclaration(statement.expression)
			) return this.format(statement.expression);
			else return this.formatBinaryExpression(statement);
		}
		if (isCallExpression(statement)) return this.formatCallExpression(statement);
		if (isBinaryExpression(statement)) return this.formatBinaryExpression(statement);
		if (isExportAssignment(statement)) return this.formatExportAssignment(statement);
		if (isClassDeclaration(statement)) return this.formatClassDeclaration(statement);
		if (isFunctionDeclaration(statement)) return this.formatFunctionDeclaration(statement);
		if (isVariableStatement(statement)) return this.formatVariableStatement(statement);
		if (isExportDeclaration(statement)) return this.formatExportDeclaration(statement);

		const kind = (<{ kind: SyntaxKind }>statement).kind;
		throw new TypeError(`${ExportFormatter.constructor.name} could not get an IExportDeclaration for a statement of kind ${SyntaxKind[kind]}!`);
	}

	/**
	 * Formats the given CallExpression into an IExportDeclaration, if possible.
	 * @param {CallExpression} statement
	 * @returns {IExportDeclaration|null}
	 */
	private formatCallExpression (statement: CallExpression): IExportDeclaration|null {
		const formatted = callExpressionFormatter.format(statement);
		if (formatted.identifier !== "___export") return null;

		// This is a namespace export in commonjs format.
		const argument = statement.arguments.find(arg => isCallExpression(arg));
		if (argument == null) return null;

		const {startsAt, endsAt, filePath, fullPath, relativePath, payload} = <IRequire>requireFormatter.format(<CallExpression>argument);

		const map: IExportDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.EXPORT,
			startsAt,
			endsAt,
			moduleKind: ModuleDependencyKind.REQUIRE,
			source: {
				relativePath,
				fullPath
			},
			filePath,
			bindings: {
				[NAMESPACE_NAME]: {
					startsAt,
					endsAt,
					name: NAMESPACE_NAME,
					payload,
					kind: ImportExportKind.NAMESPACE,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING
				}
			}
		}, IdentifierMapKind.EXPORT);
		mapper.set(map.bindings[NAMESPACE_NAME], statement);

		mapper.set(map, statement);
		return map;
	}

	/**
	 * Formats the given ExportAssignment into an IExportDeclaration, if possible.
	 * @param {ExportAssignment} statement
	 * @returns {IExportDeclaration}
	 */
	private formatExportAssignment (statement: ExportAssignment): IExportDeclaration {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		const payload = () => {

			if (isLiteralExpression(statement.expression)) {
				const value = valueableFormatter.format(statement.expression);
				const obj = {
					___kind: IdentifierMapKind.LITERAL,
					startsAt: statement.expression.pos,
					endsAt: statement.expression.end,
					value: () => value.expression == null ? [] : value.expression
				};
				mapper.set(obj, statement.expression);
				return obj;

			} else {
				const identifier = nameGetter.getName(statement.expression);
				const scope = tracer.traceThis(statement);
				return tracer.traceIdentifier(identifier, statement, scope);
			}
		};

		const relativePath = () => filePath;
		const fullPath = () => this.formatFullPathFromRelative(filePath, relativePath());

		const map: IExportDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.EXPORT,
			startsAt: statement.pos,
			endsAt: statement.end,
			moduleKind: ModuleDependencyKind.ES_MODULE,
			source: {
				relativePath,
				fullPath
			},
			filePath,
			bindings: {
				/*tslint:disable:object-literal-key-quotes*/
				"default": {
					/*tslint:enable:object-literal-key-quotes*/
					startsAt: statement.pos,
					endsAt: statement.end,
					name: "default",
					payload,
					kind: ImportExportKind.DEFAULT,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING
				}
			}
		}, IdentifierMapKind.EXPORT);
		mapper.set(map.bindings/*tslint:disable*/["default"]/*tslint:enable*/, statement);

		mapper.set(map, statement);
		return map;
	}

	/**
	 * Formats the given Statement into an IExportDeclaration, if possible.
	 * @param {ExpressionStatement | BinaryExpression} statement
	 * @returns {IExportDeclaration}
	 */
	private formatBinaryExpression (statement: ExpressionStatement|BinaryExpression): IExportDeclaration|null {
		const formatted = mutationFormatter.format(statement);

		if (formatted == null) return null;
		const isCandidate = formatted.property === "exports" && formatted.identifier !== "undefined" && formatted.identifier !== undefined;
		if (!isCandidate) return null;

		const payload = () => {
			const obj = {
				___kind: IdentifierMapKind.LITERAL,
				startsAt: statement.pos,
				endsAt: statement.end,
				value: () => formatted.value.expression == null ? [] : formatted.value.expression
			};
			mapper.set(obj, statement);
			return obj;
		};
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		const relativePath = () => filePath;
		const fullPath = () => this.formatFullPathFromRelative(filePath, relativePath());
		const identifier = formatted.identifier == null || formatted.identifier === "default" ? "default" : formatted.identifier.toString();

		const map: IExportDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.EXPORT,
			startsAt: statement.pos,
			endsAt: statement.end,
			moduleKind: ModuleDependencyKind.REQUIRE,
			source: {
				relativePath,
				fullPath
			},
			filePath,
			bindings: {
				[identifier]: {
					startsAt: statement.pos,
					endsAt: statement.end,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
					name: identifier,
					payload,
					kind: identifier === "default" ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
				}
			}
		}, IdentifierMapKind.EXPORT);
		mapper.set(map.bindings[identifier], statement);

		mapper.set(map, statement);
		return map;
	}

	/**
	 * Formats the given ClassDeclaration into an IExportDeclaration, if possible.
	 * @param {ClassDeclaration} statement
	 * @returns {IExportDeclaration|null}
	 */
	private formatClassDeclaration (statement: ClassDeclaration): IExportDeclaration|null {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const classDeclaration = classFormatter.format(statement);
		const isCandidate = classDeclaration.modifiers.has("export");

		if (isCandidate) {
			const isDefault = classDeclaration.modifiers.has("default");
			const name = classDeclaration.name;
			const relativePath = () => filePath;
			const fullPath = () => this.formatFullPathFromRelative(filePath, relativePath());

			const map: IExportDeclaration = identifierUtil.setKind({
				___kind: IdentifierMapKind.EXPORT,
				startsAt: statement.pos,
				endsAt: statement.end,
				moduleKind: ModuleDependencyKind.ES_MODULE,
				source: {
					relativePath,
					fullPath
				},
				filePath,
				bindings: {
					[isDefault ? "default" : name]: {
						startsAt: statement.pos,
						endsAt: statement.end,
						___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
						name: isDefault ? "default" : name,
						payload: () => classDeclaration,
						kind: isDefault ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
					}
				}
			}, IdentifierMapKind.EXPORT);
			mapper.set(map.bindings[isDefault ? "default" : name], statement);
			mapper.set(map, statement);
			return map;
		}
		return null;
	}

	/**
	 * Formats the given FunctionDeclaration into an IExportDeclaration, if possible.
	 * @param {FunctionDeclaration} statement
	 * @returns {IExportDeclaration|null}
	 */
	private formatFunctionDeclaration (statement: FunctionDeclaration): IExportDeclaration|null {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const functionDeclaration = functionFormatter.format(statement);
		const isCandidate = functionDeclaration.modifiers.has("export");

		if (isCandidate) {
			const isDefault = functionDeclaration.modifiers.has("default");
			const name = functionDeclaration.name;
			const relativePath = () => filePath;
			const fullPath = () => this.formatFullPathFromRelative(filePath, relativePath());

			const map: IExportDeclaration = identifierUtil.setKind({
				___kind: IdentifierMapKind.EXPORT,
				startsAt: statement.pos,
				endsAt: statement.end,
				moduleKind: ModuleDependencyKind.ES_MODULE,
				source: {
					relativePath,
					fullPath
				},
				filePath,
				bindings: {
					[isDefault ? "default" : name]: {
						startsAt: statement.pos,
						endsAt: statement.end,
						___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
						name: isDefault ? "default" : name,
						payload: () => functionDeclaration,
						kind: isDefault ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
					}
				}
			}, IdentifierMapKind.EXPORT);
			mapper.set(map.bindings[isDefault ? "default" : name], statement);
			mapper.set(map, statement);
			return map;
		}
		return null;
	}

	/**
	 * Formats the given VariableStatement into an IExportDeclaration, if possible.
	 * @param {VariableStatement} statement
	 * @returns {IExportDeclaration|null}
	 */
	private formatVariableStatement (statement: VariableStatement): IExportDeclaration|null {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const variableIndexer = variableFormatter.format(statement);

		for (const key of Object.keys(variableIndexer)) {
			const match = variableIndexer[key];
			const isCandidate = match.modifiers.has("export");

			if (isCandidate) {
				const isDefault = match.modifiers.has("default");
				const name = match.name;
				const relativePath = () => filePath;
				const fullPath = () => this.formatFullPathFromRelative(filePath, relativePath());

				const map: IExportDeclaration = identifierUtil.setKind({
					___kind: IdentifierMapKind.EXPORT,
					startsAt: statement.pos,
					endsAt: statement.end,
					moduleKind: ModuleDependencyKind.ES_MODULE,
					source: {
						relativePath,
						fullPath
					},
					filePath,
					bindings: {
						[isDefault ? "default" : name]: {
							startsAt: statement.pos,
							endsAt: statement.end,
							___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
							name: isDefault ? "default" : name,
							payload: () => match,
							kind: isDefault ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
						}
					}
				}, IdentifierMapKind.EXPORT);
				mapper.set(map.bindings[isDefault ? "default" : name], statement);
				mapper.set(map, statement);
				return map;
			}
		}
		return null;
	}

	/**
	 * Formats the given ExportDeclaration into an IExportDeclaration, if possible.
	 * @param {ExportDeclaration} statement
	 * @returns {IExportDeclaration}
	 */
	private formatExportDeclaration (statement: ExportDeclaration): IExportDeclaration {
		const sourceFileProperties = sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		const relativePath = () => {
			const path = statement.moduleSpecifier == null ? filePath : <string>nameGetter.getNameOfMember(statement.moduleSpecifier, false, true);
			if (path.toString().length < 1) {
				throw new TypeError(`${ExportFormatter.constructor.name} detected an export with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
			}
			return path;
		};
		const fullPath = () => this.formatFullPathFromRelative(filePath, relativePath());

		const map: IExportDeclaration = identifierUtil.setKind({
			___kind: IdentifierMapKind.EXPORT,
			startsAt: statement.pos,
			endsAt: statement.end,
			moduleKind: ModuleDependencyKind.ES_MODULE,
			source: {
				relativePath,
				fullPath
			},
			filePath,
			bindings: this.formatExportClause(statement.exportClause, fullPath, statement)
		}, IdentifierMapKind.EXPORT);

		mapper.set(map, statement);
		return map;
	}

	/**
	 * Formats the given NamedExports into an IImportExportIndexer
	 * @param {NamedExports?} clause
	 * @param {() => string} modulePath
	 * @param {ExportDeclaration} statement
	 * @returns {IImportExportIndexer}
	 */
	private formatExportClause (clause: NamedExports|undefined, modulePath: () => string, statement: ExportDeclaration): IImportExportIndexer {
		const indexer: IImportExportIndexer = {};

		if (clause == null) {
			const payload = () => {
				const path = modulePath();
				const obj = {
					___kind: IdentifierMapKind.LITERAL,
					startsAt: statement.pos,
					endsAt: statement.end,
					value: () => [this.moduleToNamespacedObjectLiteral(exportDeclarationGetter.getForFile(path, true))]
				};
				mapper.set(obj, statement);
				return obj;
			};

			indexer[NAMESPACE_NAME] = {
				startsAt: statement.pos,
				endsAt: statement.end,
				___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
				name: NAMESPACE_NAME,
				payload,
				kind: ImportExportKind.NAMESPACE
			};
			mapper.set(indexer[NAMESPACE_NAME], statement);
		} else {
			clause.elements.forEach(element => {

				const payload = () => {
					const path = modulePath();
					const block = tracer.traceBlockScopeName(clause);
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
		return indexer;
	}
}