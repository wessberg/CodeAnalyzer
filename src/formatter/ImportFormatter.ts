import {IFileLoader} from "@wessberg/fileloader";
import {CallExpression, Identifier, ImportClause, ImportDeclaration, ImportEqualsDeclaration, SyntaxKind, VariableDeclaration, VariableDeclarationList, VariableStatement} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {IBindingIdentifier} from "../model/interface/IBindingIdentifier";
import {isCallExpression, isExternalModuleReference, isIdentifierObject, isImportDeclaration, isImportEqualsDeclaration, isNamedImports, isNamespaceImport, isVariableDeclaration, isVariableDeclarationList, isVariableStatement} from "../predicate/PredicateFunctions";
import {ICodeAnalyzer, IdentifierMapKind, IImportDeclaration, ImportExportIndexer, ImportExportKind, IRequire, ModuleDependencyKind, NAMESPACE_NAME} from "../service/interface/ICodeAnalyzer";
import {ITracer} from "../tracer/interface/ITracer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IImportFormatter} from "./interface/IImportFormatter";
import {ModuleFormatter} from "./ModuleFormatter";
import {IRequireFormatter} from "./interface/IRequireFormatter";
import {IMarshaller} from "@wessberg/marshaller";

export class ImportFormatter extends ModuleFormatter implements IImportFormatter {
	constructor (private languageService: ICodeAnalyzer,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private nameGetter: INameGetter,
							 private requireFormatter: IRequireFormatter,
							 private mapper: IMapper,
							 private tracer: ITracer,
							 marshaller: IMarshaller,
							 stringUtil: IStringUtil,
							 fileLoader: IFileLoader) {
		super(stringUtil, marshaller, fileLoader);
	}

	public format (statement: ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression): IImportDeclaration|null {
		if (isImportDeclaration(statement)) return this.formatImportDeclaration(statement);
		if (isImportEqualsDeclaration(statement)) return this.formatImportEqualsDeclaration(statement);
		if (isVariableStatement(statement)) return this.formatVariableStatement(statement);
		if (isVariableDeclaration(statement)) return this.formatVariableDeclaration(statement);
		if (isVariableDeclarationList(statement)) return this.formatVariableDeclarationList(statement);
		if (isCallExpression(statement)) return this.formatCallExpression(statement);

		throw new TypeError(`${ImportFormatter.constructor.name} could not get an IImportDeclaration for a statement of kind ${SyntaxKind[(<Identifier>statement).kind]}!`);
	}

	private formatImportDeclaration (statement: ImportDeclaration): IImportDeclaration {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		const relativePath = () => {
			const path = <string>this.nameGetter.getNameOfMember(statement.moduleSpecifier, false, true);
			if (path.toString().length < 1) {
				throw new TypeError(`${ImportFormatter.constructor.name} detected an import with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
			}
			return path;
		};

		const fullPath = () => {
			const relative = relativePath();
			return this.formatFullPathFromRelative(filePath, relative);
		};

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
			const {startsAt, endsAt, filePath, fullPath, relativePath, payload} = <IRequire>this.requireFormatter.format(statement.moduleReference);

			const map: IImportDeclaration = {
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
			const clojure = this.tracer.traceClojure(statement);

			const payload = () => {
				return typeof clojure === "string" ? clojure : this.tracer.findNearestMatchingIdentifier(statement, block, source.toString(), clojure);
			};

			const map: IImportDeclaration = {
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
		return this.formatVariableDeclarationList(statement.declarationList);
	}

	private formatVariableDeclarationList (statement: VariableDeclarationList): IImportDeclaration|null {
		for (const declaration of statement.declarations) {
			const formatted = this.formatVariableDeclaration(declaration);
			if (formatted != null) return formatted;
		}
		return null;
	}

	private formatVariableDeclaration (statement: VariableDeclaration): IImportDeclaration|null {
		const name = this.nameGetter.getName(statement.name);
		return this.formatCallExpression(statement, name == null ? undefined : name);
	}

	private formatCallExpression (statement: CallExpression|VariableStatement|VariableDeclaration|VariableDeclarationList, name: string = NAMESPACE_NAME): IImportDeclaration|null {
		const requireCall = this.requireFormatter.format(statement);
		if (requireCall == null) return null;
		const {startsAt, endsAt, relativePath, fullPath, filePath, payload} = requireCall;

		const map: IImportDeclaration = {
			___kind: IdentifierMapKind.IMPORT,
			startsAt,
			endsAt,
			moduleKind: ModuleDependencyKind.REQUIRE,
			source: {
				relativePath,
				fullPath
			},
			filePath,
			bindings: {
				[name]: {
					startsAt: requireCall.arguments.startsAt,
					endsAt: requireCall.arguments.endsAt,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
					name,
					payload,
					kind: ImportExportKind.NAMESPACE
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

	/**
	 * formats the given ImportClause and returns an ImportIndexer.
	 * @param {ImportClause} clause
	 * @param {string} modulePath
	 * @returns {ImportExportIndexer}
	 */
	private formatImportClause (clause: ImportClause, modulePath: () => string): ImportExportIndexer {
		const indexer: ImportExportIndexer = {};

		if (clause.namedBindings != null && isNamespaceImport(clause.namedBindings)) {
			const payload = () => {
				const path = modulePath();
				return this.moduleToNamespacedObjectLiteral(this.languageService.getExportDeclarationsForFile(path, true));
			};

			indexer[clause.namedBindings.name.text] = {
				startsAt: clause.namedBindings.name.pos,
				endsAt: clause.namedBindings.name.end,
				___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
				name: clause.namedBindings.name.text,
				payload,
				kind: ImportExportKind.NAMESPACE
			};
		}

		else if (clause.namedBindings != null && isNamedImports(clause.namedBindings)) {
			clause.namedBindings.elements.forEach(element => {
				const block = this.tracer.traceBlockScopeName(clause);
				const payload = () => {
					const path = modulePath();
					const clojure = this.tracer.traceClojure(path);
					return typeof clojure === "string" ? clojure : this.tracer.findNearestMatchingIdentifier(clause, block, element.name.text, clojure);
				};

				indexer[element.name.text] = {
					startsAt: element.name.pos,
					endsAt: element.name.end,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
					name: element.name.text,
					payload,
					kind: ImportExportKind.NAMED
				};
			});
		}

		if (clause.name != null) {
			const payload = () => {
				const path = modulePath();
				const fileExports = this.languageService.getExportDeclarationsForFile(path, true);
				const match = fileExports.find(exportDeclaration => exportDeclaration.bindings["default"] != null);
				if (match == null) throw new ReferenceError(`${this.formatImportClause.name} could not extract a default export from ${modulePath}! The module doesn't contain a default export.`);
				return match.bindings["default"].payload;
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