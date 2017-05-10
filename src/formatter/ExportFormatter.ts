import {ClassDeclaration, ExportAssignment, ExportDeclaration, FunctionDeclaration, NamedExports, SyntaxKind, VariableStatement} from "typescript";
import {INameGetter} from "../getter/interface/INameGetter";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {ArbitraryValue, IdentifierMapKind, IExportDeclaration, IIdentifier, ImportExportIndexer, ImportExportKind, INonNullableValueable, ISimpleLanguageService, IValueable, ModuleDependencyKind} from "../service/interface/ISimpleLanguageService";
import {IMapper} from "../mapper/interface/IMapper";
import {isClassDeclaration, isExportAssignment, isExportDeclaration, isFunctionDeclaration, isLiteralExpression, isVariableStatement} from "../predicate/PredicateFunctions";
import {ITracer} from "../tracer/interface/ITracer";
import {IExportFormatter} from "./interface/IExportFormatter";
import {IVariableFormatter} from "./interface/IVariableFormatter";
import {ModuleFormatter} from "./ModuleFormatter";
import {IClassFormatter} from "./interface/IClassFormatter";
import {IFunctionFormatter} from "./interface/IFunctionFormatter";
import {IStringUtil} from "../util/interface/IStringUtil";

export class ExportFormatter extends ModuleFormatter implements IExportFormatter {

	constructor (private languageService: ISimpleLanguageService,
							 private mapper: IMapper,
							 private valueExpressionGetter: IValueExpressionGetter,
							 private valueResolvedGetter: IValueResolvedGetter,
							 private sourceFilePropertiesGetter: ISourceFilePropertiesGetter,
							 private variableFormatter: IVariableFormatter,
							 private classFormatter: IClassFormatter,
							 private functionFormatter: IFunctionFormatter,
							 private nameGetter: INameGetter,
							 private tracer: ITracer,
							 stringUtil: IStringUtil) {
		super(stringUtil);
	}

	public format (statement: ExportDeclaration | VariableStatement | ExportAssignment | FunctionDeclaration | ClassDeclaration): IExportDeclaration | null {
		if (isExportAssignment(statement)) return this.formatExportAssignment(statement);
		if (isClassDeclaration(statement)) return this.formatClassDeclaration(statement);
		if (isFunctionDeclaration(statement)) return this.formatFunctionDeclaration(statement);
		if (isVariableStatement(statement)) return this.formatVariableStatement(statement);
		if (isExportDeclaration(statement)) return this.formatExportDeclaration(statement);

		const kind = (<{ kind: SyntaxKind }>statement).kind;
		throw new TypeError(`${ExportFormatter.constructor.name} could not get an IExportDeclaration for a statement of kind ${SyntaxKind[kind]}!`);
	}


	private formatExportAssignment (statement: ExportAssignment): IExportDeclaration {
		const sourceFileProperties = this.sourceFilePropertiesGetter.getSourceFileProperties(statement);
		const filePath = sourceFileProperties.filePath;
		let payload: ArbitraryValue | IIdentifier;

		if (isLiteralExpression(statement.expression)) {
			const that = this;
			const scope = this.tracer.traceThis(statement.expression);
			const value: IValueable = {
				expression: this.valueExpressionGetter.getValueExpression(statement.expression),
				resolved: undefined,
				hasDoneFirstResolve () {return value.resolved !== undefined;},
				resolving: false,
				resolve () {
					value.resolved = value.expression == null ? null : that.valueResolvedGetter.getValueResolved(<INonNullableValueable>value, statement.expression, scope);
					return value.resolved;
				}
			};
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
			bindings: {"default": {name: "default", payload, kind: ImportExportKind.DEFAULT}}
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.EXPORT,
			enumerable: false
		});

		this.mapper.set(map, statement);
		return map;
	}

	private formatClassDeclaration (statement: ClassDeclaration): IExportDeclaration | null {
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

	private formatFunctionDeclaration (statement: FunctionDeclaration): IExportDeclaration | null {
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

	private formatVariableStatement (statement: VariableStatement): IExportDeclaration | null {
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
			bindings: this.formatExportClause(statement.exportClause, fullPath)
		};
		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.EXPORT,
			enumerable: false
		});
		this.mapper.set(map, statement);
		return map;
	}

	private formatExportClause (clause: NamedExports | undefined, modulePath: string): ImportExportIndexer {
		const indexer: ImportExportIndexer = {};

		if (clause == null) {
			const payload = this.moduleToNamespacedObjectLiteral(this.languageService.getExportDeclarationsForFile(modulePath, true));
			indexer["*"] = {
				name: "*",
				payload,
				kind: ImportExportKind.NAMESPACE
			};
		} else {
			clause.elements.forEach(element => {
				const block = this.tracer.traceBlockScopeName(clause);
				const payload = this.tracer.findNearestMatchingIdentifier(clause, block, element.name.text);
				indexer[element.name.text] = {
					name: element.name.text,
					payload,
					kind: ImportExportKind.NAMED
				};
			});
		}

		return indexer;
	}
}