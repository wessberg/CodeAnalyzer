import {IFileLoader} from "@wessberg/fileloader";
import {BinaryExpression, CallExpression, ClassDeclaration, ExportAssignment, ExportDeclaration, ExpressionStatement, FunctionDeclaration, NamedExports, SyntaxKind, VariableStatement} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {isBinaryExpression, isCallExpression, isClassDeclaration, isExportAssignment, isExportDeclaration, isExpressionStatement, isFunctionDeclaration, isLiteralExpression, isVariableStatement} from "../predicate/PredicateFunctions";
import {ArbitraryValue, ICodeAnalyzer, IdentifierMapKind, IExportDeclaration, IIdentifier, ImportExportIndexer, ImportExportKind, ModuleDependencyKind} from "../service/interface/ICodeAnalyzer";
import {ITracer} from "../tracer/interface/ITracer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {IClassFormatter} from "./interface/IClassFormatter";
import {IExportFormatter} from "./interface/IExportFormatter";
import {IFunctionFormatter} from "./interface/IFunctionFormatter";
import {IVariableFormatter} from "./interface/IVariableFormatter";
import {ModuleFormatter} from "./ModuleFormatter";
import {IMutationFormatter} from "./interface/IMutationFormatter";
import {ICallExpressionFormatter} from "./interface/ICallExpressionFormatter";
import {IValueableFormatter} from "./interface/IValueableFormatter";
import {IMarshaller} from "@wessberg/marshaller";

export class ExportFormatter extends ModuleFormatter implements IExportFormatter {

	constructor (private languageService: ICodeAnalyzer,
							 private mapper: IMapper,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private valueableFormatter: IValueableFormatter,
							 private callExpressionFormatter: ICallExpressionFormatter,
							 private variableFormatter: IVariableFormatter,
							 private classFormatter: IClassFormatter,
							 private mutationFormatter: IMutationFormatter,
							 private functionFormatter: IFunctionFormatter,
							 private nameGetter: INameGetter,
							 private tracer: ITracer,
							 marshaller: IMarshaller,
							 stringUtil: IStringUtil,
							 fileLoader: IFileLoader) {
		super(stringUtil, marshaller, fileLoader);
	}

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

	private formatCallExpression (statement: CallExpression): IExportDeclaration|null {
		const formatted = this.callExpressionFormatter.format(statement);
		if (formatted.identifier !== "___export") return null;

		// This is a namespace export in commonjs format.
		const value = formatted.arguments.argumentsList[0].value;
		const payload = value.hasDoneFirstResolve() ? value.resolved : value.resolve();

		const relativePath = formatted.filePath;
		const fullPath = this.formatFullPathFromRelative(formatted.filePath, relativePath);

		const map: IExportDeclaration = {
			___kind: IdentifierMapKind.EXPORT,
			startsAt: statement.pos,
			endsAt: statement.end,
			moduleKind: ModuleDependencyKind.REQUIRE,
			source: {
				relativePath,
				fullPath
			},
			filePath: formatted.filePath,
			bindings: {
				"*": {
					startsAt: statement.pos,
					endsAt: statement.end,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
					name: "*",
					payload,
					kind: ImportExportKind.NAMESPACE
				}
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.EXPORT,
			enumerable: false
		});

		this.mapper.set(map, statement);
		return map;
	}


	private formatExportAssignment (statement: ExportAssignment): IExportDeclaration {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		let payload: ArbitraryValue|IIdentifier;

		if (isLiteralExpression(statement.expression)) {
			const value = this.valueableFormatter.format(statement.expression);
			payload = value.resolve();
		} else {
			const identifier = this.nameGetter.getName(statement.expression);
			const scope = this.tracer.traceThis(statement);
			payload = identifier == null ? null : this.tracer.traceIdentifier(identifier, statement, scope);
		}

		const relativePath = filePath;
		const fullPath = this.formatFullPathFromRelative(filePath, relativePath);

		const map: IExportDeclaration = {
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
				"default": {
					startsAt: statement.pos,
					endsAt: statement.end,
					name: "default",
					payload,
					kind: ImportExportKind.DEFAULT,
					___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING
				}
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.EXPORT,
			enumerable: false
		});

		this.mapper.set(map, statement);
		return map;
	}

	private formatBinaryExpression (statement: ExpressionStatement|BinaryExpression): IExportDeclaration|null {
		const formatted = this.mutationFormatter.format(statement);

		if (formatted == null) return null;
		const isCandidate = formatted.property === "exports" && formatted.identifier !== "undefined" && formatted.identifier !== undefined;
		if (!isCandidate) return null;

		const payload = formatted.value.hasDoneFirstResolve() ? formatted.value.resolved : formatted.value.resolve();
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;

		const relativePath = filePath;
		const fullPath = this.formatFullPathFromRelative(filePath, relativePath);
		const identifier = formatted.identifier == null || formatted.identifier === "default" ? "default" : formatted.identifier.toString();

		const map: IExportDeclaration = {
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
					kind: identifier ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
				}
			}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.EXPORT,
			enumerable: false
		});

		this.mapper.set(map, statement);
		return map;
	}

	private formatClassDeclaration (statement: ClassDeclaration): IExportDeclaration|null {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const classDeclaration = this.classFormatter.format(statement);
		const isCandidate = classDeclaration.modifiers.has("export");

		if (isCandidate) {
			const isDefault = classDeclaration.modifiers.has("default");
			const name = classDeclaration.name;
			const relativePath = filePath;
			const fullPath = this.formatFullPathFromRelative(filePath, relativePath);

			const map: IExportDeclaration = {
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
						payload: classDeclaration,
						kind: isDefault ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
					}
				}
			};
			// Make the kind non-enumerable.
			Object.defineProperty(map, "___kind", {
				value: IdentifierMapKind.EXPORT,
				enumerable: false
			});

			this.mapper.set(map, statement);
			return map;
		}
		return null;
	}

	private formatFunctionDeclaration (statement: FunctionDeclaration): IExportDeclaration|null {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const functionDeclaration = this.functionFormatter.format(statement);
		const isCandidate = functionDeclaration.modifiers.has("export");

		if (isCandidate) {
			const isDefault = functionDeclaration.modifiers.has("default");
			const name = functionDeclaration.name;
			const relativePath = filePath;
			const fullPath = this.formatFullPathFromRelative(filePath, relativePath);

			const map: IExportDeclaration = {
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
						payload: functionDeclaration,
						kind: isDefault ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
					}
				}
			};
			// Make the kind non-enumerable.
			Object.defineProperty(map, "___kind", {
				value: IdentifierMapKind.EXPORT,
				enumerable: false
			});

			this.mapper.set(map, statement);
			return map;
		}
		return null;
	}

	private formatVariableStatement (statement: VariableStatement): IExportDeclaration|null {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const variableIndexer = this.variableFormatter.format(statement);

		for (const key of Object.keys(variableIndexer)) {
			const match = variableIndexer[key];
			const isCandidate = match.modifiers.has("export");

			if (isCandidate) {
				const isDefault = match.modifiers.has("default");
				const name = match.name;
				const relativePath = filePath;
				const fullPath = this.formatFullPathFromRelative(filePath, relativePath);

				const map: IExportDeclaration = {
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
							payload: match,
							kind: isDefault ? ImportExportKind.DEFAULT : ImportExportKind.NAMED
						}
					}
				};
				// Make the kind non-enumerable.
				Object.defineProperty(map, "___kind", {
					value: IdentifierMapKind.EXPORT,
					enumerable: false
				});

				this.mapper.set(map, statement);
				return map;
			}
		}
		return null;
	}

	private formatExportDeclaration (statement: ExportDeclaration): IExportDeclaration {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		const relativePath = statement.moduleSpecifier == null ? filePath : <string>this.nameGetter.getNameOfMember(statement.moduleSpecifier, false, true);
		if (relativePath.toString().length < 1) {
			throw new TypeError(`${ExportFormatter.constructor.name} detected an export with an empty path around here: ${sourceFileProperties.fileContents.slice(statement.pos, statement.end)} in file: ${filePath} on index ${statement.pos}`);
		}
		const fullPath = this.formatFullPathFromRelative(filePath, relativePath);

		const map: IExportDeclaration = {
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
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.EXPORT,
			enumerable: false
		});
		this.mapper.set(map, statement);
		return map;
	}

	private formatExportClause (clause: NamedExports|undefined, modulePath: string, statement: ExportDeclaration): ImportExportIndexer {
		const indexer: ImportExportIndexer = {};

		if (clause == null) {
			const payload = this.moduleToNamespacedObjectLiteral(this.languageService.getExportDeclarationsForFile(modulePath, true));
			indexer["*"] = {
				startsAt: statement.pos,
				endsAt: statement.end,
				___kind: IdentifierMapKind.IMPORT_EXPORT_BINDING,
				name: "*",
				payload,
				kind: ImportExportKind.NAMESPACE
			};
		} else {
			clause.elements.forEach(element => {
				const block = this.tracer.traceBlockScopeName(clause);
				const clojure = this.tracer.traceClojure(modulePath);
				const payload = typeof clojure === "string" ? clojure : this.tracer.findNearestMatchingIdentifier(clause, block, element.name.text, clojure);

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

		return indexer;
	}
}