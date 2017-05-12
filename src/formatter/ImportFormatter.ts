import {CallExpression, Identifier, ImportDeclaration, ImportEqualsDeclaration, SyntaxKind, VariableStatement, ImportClause} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IBindingIdentifier} from "../model/interface/IBindingIdentifier";
import {IdentifierMapKind, IImportDeclaration, ImportExportIndexer, ImportExportKind, ISimpleLanguageService, ModuleDependencyKind} from "../service/interface/ISimpleLanguageService";
import {IMapper} from "../mapper/interface/IMapper";
import {isCallExpression, isExternalModuleReference, isIdentifierObject, isImportDeclaration, isImportEqualsDeclaration, isNamedImports, isNamespaceImport, isVariableStatement} from "../predicate/PredicateFunctions";
import {ITracer} from "../tracer/interface/ITracer";
import {IImportFormatter} from "./interface/IImportFormatter";
import {IVariableFormatter} from "./interface/IVariableFormatter";
import {ModuleFormatter} from "./ModuleFormatter";
import {ICallExpressionFormatter} from "./interface/ICallExpressionFormatter";
import {BindingIdentifier} from "../model/BindingIdentifier";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IFileLoader} from "@wessberg/fileloader";

export class ImportFormatter extends ModuleFormatter implements IImportFormatter {
	constructor (private languageService: ISimpleLanguageService,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private nameGetter: INameGetter,
							 private callExpressionFormatter: ICallExpressionFormatter,
							 private variableFormatter: IVariableFormatter,
							 private mapper: IMapper,
							 private tracer: ITracer,
							 stringUtil: IStringUtil,
							 fileLoader: IFileLoader) {
		super(stringUtil, fileLoader);
	}

	public format (statement: ImportDeclaration | ImportEqualsDeclaration | VariableStatement | CallExpression): IImportDeclaration | null {
		if (isImportDeclaration(statement)) return this.formatImportDeclaration(statement);
		if (isImportEqualsDeclaration(statement)) return this.formatImportEqualsDeclaration(statement);
		if (isVariableStatement(statement)) return this.formatVariableStatement(statement);
		if (isCallExpression(statement)) return this.formatCallExpression(statement);

		throw new TypeError(`${ImportFormatter.constructor.name} could not get an IImportDeclaration for a statement of kind ${SyntaxKind[(<Identifier>statement).kind]}!`);
	}

	private formatImportDeclaration (statement: ImportDeclaration): IImportDeclaration {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		const relativePath = <string>this.nameGetter.getNameOfMember(statement.moduleSpecifier, false, true);
		if (relativePath.toString().length < 1) {
			throw new TypeError(`${ImportFormatter.constructor.name} detected an import with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
		}
		const fullPath = this.formatFullPathFromRelative(filePath, relativePath);

		const map: IImportDeclaration = {
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
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.IMPORT,
			enumerable: false
		});
		this.mapper.set(map, statement);
		return map;
	}

	private formatImportEqualsDeclaration (statement: ImportEqualsDeclaration): IImportDeclaration {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		if (isExternalModuleReference(statement.moduleReference)) {
			const relativePath = statement.moduleReference.expression == null ? "" : <string>this.nameGetter.getNameOfMember(statement.moduleReference.expression, false, true);
			if (relativePath.toString().length < 1) {
				throw new TypeError(`${ImportFormatter.constructor.name} detected an import with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
			}
			const fullPath = this.formatFullPathFromRelative(filePath, relativePath);
			const fileExports = this.languageService.getExportDeclarationsForFile(fullPath, true);
			const match = fileExports.find(exportDeclaration => exportDeclaration.bindings["default"] != null);
			if (match == null) throw new ReferenceError(`${ImportFormatter.constructor.name} could not extract a default export from ${fullPath}! The module doesn't contain a default export.`);
			const payload = match.bindings["default"].payload;

			const map: IImportDeclaration = {
				___kind: IdentifierMapKind.IMPORT,
				startsAt: statement.pos,
				endsAt: statement.end,
				moduleKind: ModuleDependencyKind.IMPORT_REQUIRE,
				source: {
					relativePath,
					fullPath
				},
				filePath,
				bindings: {[statement.name.text]: {name: statement.name.text, payload, kind: ImportExportKind.DEFAULT}}
			};
			// Make the kind non-enumerable.
			Object.defineProperty(map, "___kind", {
				value: IdentifierMapKind.IMPORT,
				enumerable: false
			});

			this.mapper.set(map, statement);
			return map;

		} else {
			if (!isIdentifierObject(statement.moduleReference)) {
				throw new TypeError(`${ImportFormatter.constructor.name} could not find the name for a module reference!`);
			}

			const source = <IBindingIdentifier>this.nameGetter.getNameOfMember(statement.moduleReference, false, false);
			const block = this.tracer.traceBlockScopeName(statement);
			const payload = this.tracer.findNearestMatchingIdentifier(statement, block, source.toString());

			const map: IImportDeclaration = {
				___kind: IdentifierMapKind.IMPORT,
				startsAt: statement.pos,
				endsAt: statement.end,
				moduleKind: ModuleDependencyKind.IMPORT_REQUIRE,
				source,
				filePath,
				bindings: {
					[statement.name.text]: {
						name: statement.name.text,
						payload,
						kind: ImportExportKind.DEFAULT
					}
				}
			};
			// Make the kind non-enumerable.
			Object.defineProperty(map, "___kind", {
				value: IdentifierMapKind.IMPORT,
				enumerable: false
			});

			this.mapper.set(map, statement);
			return map;
		}
	}

	private formatVariableStatement (statement: VariableStatement): IImportDeclaration|null {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const variableIndexer = this.variableFormatter.format(statement);

		for (const key of Object.keys(variableIndexer)) {
			const match = variableIndexer[key];
			const matchingRequireCallIndex = match.value.expression == null ? -1 : match.value.expression.findIndex(exp => exp instanceof BindingIdentifier && exp.name === "require");
			if (matchingRequireCallIndex >= 0) {
				const name = match.name;
				const relativePath = match.value.expression == null ? "" : <string>match.value.expression.find((exp, index) => index > matchingRequireCallIndex && exp !== "(");
				if (relativePath.toString().length < 1) {
					throw new TypeError(`${ImportFormatter.constructor.name} detected an import with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
				}
				const fullPath = this.formatFullPathFromRelative(filePath, relativePath);
				const fileExports = this.languageService.getExportDeclarationsForFile(fullPath, true);
				const defaultExportMatch = fileExports.find(exportDeclaration => exportDeclaration.bindings["default"] != null);
				if (defaultExportMatch == null) throw new ReferenceError(`${ImportFormatter.constructor.name} could not extract a default export from ${fullPath}! The module doesn't contain a default export.`);
				const payload = defaultExportMatch.bindings["default"].payload;

				const map: IImportDeclaration = {
					___kind: IdentifierMapKind.IMPORT,
					startsAt: statement.pos,
					endsAt: statement.end,
					moduleKind: ModuleDependencyKind.REQUIRE,
					source: {
						relativePath,
						fullPath
					},
					filePath,
					bindings: {
						[name]: {
							name,
							payload,
							kind: ImportExportKind.DEFAULT
						}
					}
				};
				// Make the kind non-enumerable.
				Object.defineProperty(map, "___kind", {
					value: IdentifierMapKind.IMPORT,
					enumerable: false
				});

				this.mapper.set(map, statement);
				return map;
			}
		}
		return null;
	}

	private formatCallExpression (statement: CallExpression): IImportDeclaration|null {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const callExpression = this.callExpressionFormatter.format(statement);

		if (callExpression.identifier === "require" && callExpression.property == null) {
			const firstArgumentValue = callExpression.arguments.argumentsList[0].value;
			const relative = this.stringUtil.stripQuotesIfNecessary(firstArgumentValue == null ? "" : firstArgumentValue.hasDoneFirstResolve()
				? firstArgumentValue.resolved
				: firstArgumentValue.resolve());
			const relativePath = relative == null ? filePath : relative.toString();

			if (relativePath == null || relativePath.toString().length < 1) {
				throw new TypeError(`${ImportFormatter.constructor.name} detected an import with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
			}
			const fullPath = this.formatFullPathFromRelative(filePath, relativePath);
			const payload = this.moduleToNamespacedObjectLiteral(this.languageService.getExportDeclarationsForFile(fullPath, true));

			const map: IImportDeclaration = {
				___kind: IdentifierMapKind.IMPORT,
				startsAt: statement.pos,
				endsAt: statement.end,
				moduleKind: ModuleDependencyKind.REQUIRE,
				source: {
					relativePath,
					fullPath
				},
				filePath,
				bindings: {
					"default": {
						name: "default",
						payload,
						kind: ImportExportKind.DEFAULT
					}
				}
			};
			// Make the kind non-enumerable.
			Object.defineProperty(map, "___kind", {
				value: IdentifierMapKind.IMPORT,
				enumerable: false
			});

			this.mapper.set(map, statement);
			return map;
		}
		return null;
	}

	/**
	 * formats the given ImportClause and returns an ImportIndexer.
	 * @param {ImportClause} clause
	 * @param {string} modulePath
	 * @returns {ImportExportIndexer}
	 */
	private formatImportClause (clause: ImportClause, modulePath: string): ImportExportIndexer {
		const indexer: ImportExportIndexer = {};

		if (clause.namedBindings != null && isNamespaceImport(clause.namedBindings)) {
			const payload = this.moduleToNamespacedObjectLiteral(this.languageService.getExportDeclarationsForFile(modulePath, true));
			indexer[clause.namedBindings.name.text] = {
				name: clause.namedBindings.name.text,
				payload,
				kind: ImportExportKind.NAMESPACE
			};
		}

		else if (clause.namedBindings != null && isNamedImports(clause.namedBindings)) {
			clause.namedBindings.elements.forEach(element => {
				const block = this.tracer.traceBlockScopeName(clause);
				const payload = this.tracer.findNearestMatchingIdentifier(clause, block, element.name.text);
				indexer[element.name.text] = {
					name: element.name.text,
					payload,
					kind: ImportExportKind.NAMED
				};
			});
		}

		else if (clause.name != null) {
			const fileExports = this.languageService.getExportDeclarationsForFile(modulePath, true);
			const match = fileExports.find(exportDeclaration => exportDeclaration.bindings["default"] != null);
			if (match == null) throw new ReferenceError(`${this.formatImportClause.name} could not extract a default export from ${modulePath}! The module doesn't contain a default export.`);
			const payload = match.bindings["default"].payload;
			indexer[clause.name.text] = {
				name: clause.name.text,
				payload,
				kind: ImportExportKind.DEFAULT
			};
		}

		return indexer;
	}

}