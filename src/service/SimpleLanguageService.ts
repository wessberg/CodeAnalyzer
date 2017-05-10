import {IMarshaller} from "@wessberg/marshaller";
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {TypeExpressionGetter} from "../getter/TypeExpressionGetter";
import * as ts from "typescript";
import {CallExpression, ClassDeclaration, CompilerOptions, Declaration, ExportAssignment, ExportDeclaration, Expression, FunctionDeclaration, ImportDeclaration, ImportEqualsDeclaration, IScriptSnapshot, LanguageService, ModuleKind, Node, NodeArray, ScriptTarget, Statement, SyntaxKind, VariableStatement} from "typescript";
import {Cache} from "../cache/Cache";
import {ICache} from "../cache/interface/ICache";
import {ArgumentsFormatter} from "../formatter/ArgumentsFormatter";
import {CallExpressionFormatter} from "../formatter/CallExpressionFormatter";
import {ClassFormatter} from "../formatter/ClassFormatter";
import {ConstructorFormatter} from "../formatter/ConstructorFormatter";
import {DecoratorsFormatter} from "../formatter/DecoratorsFormatter";
import {EnumFormatter} from "../formatter/EnumFormatter";
import {ExportFormatter} from "../formatter/ExportFormatter";
import {FunctionFormatter} from "../formatter/FunctionFormatter";
import {HeritageClauseFormatter} from "../formatter/HeritageClauseFormatter";
import {ImportFormatter} from "../formatter/ImportFormatter";
import {IArgumentsFormatter} from "../formatter/interface/IArgumentsFormatter";
import {ICallExpressionFormatter} from "../formatter/interface/ICallExpressionFormatter";
import {IClassFormatter} from "../formatter/interface/IClassFormatter";
import {IConstructorFormatter} from "../formatter/interface/IConstructorFormatter";
import {IDecoratorsFormatter} from "../formatter/interface/IDecoratorsFormatter";
import {IEnumFormatter} from "../formatter/interface/IEnumFormatter";
import {IExportFormatter} from "../formatter/interface/IExportFormatter";
import {IFunctionFormatter} from "../formatter/interface/IFunctionFormatter";
import {IHeritageClauseFormatter} from "../formatter/interface/IHeritageClauseFormatter";
import {IImportFormatter} from "../formatter/interface/IImportFormatter";
import {IMethodFormatter} from "../formatter/interface/IMethodFormatter";
import {IModifiersFormatter} from "../formatter/interface/IModifiersFormatter";
import {INewExpressionFormatter} from "../formatter/interface/INewExpressionFormatter";
import {IParametersFormatter} from "../formatter/interface/IParametersFormatter";
import {IPropFormatter} from "../formatter/interface/IPropFormatter";
import {IVariableFormatter} from "../formatter/interface/IVariableFormatter";
import {MethodFormatter} from "../formatter/MethodFormatter";
import {ModifiersFormatter} from "../formatter/ModifiersFormatter";
import {NewExpressionFormatter} from "../formatter/NewExpressionFormatter";
import {ParametersFormatter} from "../formatter/ParametersFormatter";
import {PropFormatter} from "../formatter/PropFormatter";
import {VariableFormatter} from "../formatter/VariableFormatter";
import {INameGetter} from "../getter/interface/INameGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {NameGetter} from "../getter/NameGetter";
import {SourceFilePropertiesGetter} from "../getter/SourceFilePropertiesGetter";
import {ValueExpressionGetter} from "../getter/ValueExpressionGetter";
import {ValueResolvedGetter} from "../getter/ValueResolvedGetter";
import {ClassIndexer, EnumIndexer, FunctionIndexer, ICallExpression, IClassDeclaration, IdentifierMapKind, IExportDeclaration, IIdentifierMap, IImportDeclaration, INewExpression, ISimpleLanguageService, VariableIndexer} from "./interface/ISimpleLanguageService";
import {ISimpleLanguageServiceConfig} from "./interface/ISimpleLanguageServiceConfig";
import {IMapper} from "../mapper/interface/IMapper";
import {Mapper} from "../mapper/Mapper";
import {isArrayLiteralExpression, isArrowFunction, isAwaitExpression, isBinaryExpression, isBlockDeclaration, isBreakStatement, isCallExpression, isCaseBlock, isCaseClause, isClassDeclaration, isClassExpression, isConditionalExpression, isConstructorDeclaration, isContinueStatement, isDefaultClause, isDeleteExpression, isDoStatement, isElementAccessExpression, isEmptyStatement, isEnumDeclaration, isExportAssignment, isExportDeclaration, isExpressionStatement, isFalseKeyword, isFirstLiteralToken, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isIdentifierObject, isIfStatement, isImportDeclaration, isImportEqualsDeclaration, isLabeledStatement, isLiteralToken, isMethodDeclaration, isNewExpression, isNullKeyword, isNumericLiteral, isObjectLiteralExpression, isParenthesizedExpression, isPostfixUnaryExpression, isPrefixUnaryExpression, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isRegularExpressionLiteral, isReturnStatement, isShorthandPropertyAssignment, isSpreadAssignment, isSpreadElement, isStringLiteral, isSwitchStatement, isTemplateExpression, isTemplateToken, isThisKeyword, isThrowStatement, isTrueKeyword, isTryStatement, isTypeAssertionExpression, isTypeOfExpression, isUndefinedKeyword, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isWhileStatement} from "../predicate/PredicateFunctions";
import {IdentifierSerializer} from "../serializer/IdentifierSerializer";
import {IIdentifierSerializer} from "../serializer/interface/IIdentifierSerializer";
import {ITracer} from "../tracer/interface/ITracer";
import {Tracer} from "../tracer/Tracer";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {TokenSerializer} from "../serializer/TokenSerializer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {StringUtil} from "../util/StringUtil";
import {ITokenPredicator} from "../predicate/interface/ITokenPredicator";
import {TokenPredicator} from "../predicate/TokenPredicator";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {TypeUtil} from "../util/TypeUtil";

/**
 * A service that parses and reflects on the AST generated by Typescript's language service.
 * With it, we can extract metadata such as initialization values and types, arguments and import
 * declarations.
 * @author Frederik Wessberg
 */
export class SimpleLanguageService implements ISimpleLanguageService {
	private languageService: LanguageService;
	private nameGetter: INameGetter;
	private heritageClauseFormatter: IHeritageClauseFormatter;
	private variableFormatter: IVariableFormatter;
	private valueExpressionGetter: IValueExpressionGetter;
	private valueResolvedGetter: IValueResolvedGetter;
	private typeExpressionGetter: ITypeExpressionGetter;
	private sourceFilePropertiesGetter: ISourceFilePropertiesGetter;
	private mapper: IMapper;
	private cache: ICache;
	private tracer: ITracer;
	private modifiersFormatter: IModifiersFormatter;
	private importFormatter: IImportFormatter;
	private exportFormatter: IExportFormatter;
	private identifierSerializer: IIdentifierSerializer;
	private classFormatter: IClassFormatter;
	private decoratorsFormatter: IDecoratorsFormatter;
	private propFormatter: IPropFormatter;
	private parametersFormatter: IParametersFormatter;
	private argumentsFormatter: IArgumentsFormatter;
	private constructorFormatter: IConstructorFormatter;
	private methodFormatter: IMethodFormatter;
	private functionFormatter: IFunctionFormatter;
	private callExpressionFormatter: ICallExpressionFormatter;
	private newExpressionFormatter: INewExpressionFormatter;
	private enumFormatter: IEnumFormatter;
	private tokenSerializer: ITokenSerializer;
	private stringUtil: IStringUtil;
	private tokenPredicator: ITokenPredicator;
	private typeUtil: ITypeUtil;
	private files: Map<string, { version: number, content: string }> = new Map();
	private static readonly RESOLVING_STATEMENTS: Set<Statement | Expression | Node> = new Set();

	constructor (marshaller: IMarshaller,
							 private config: ISimpleLanguageServiceConfig = {},
							 private typescript: typeof ts = ts) {
		this.languageService = this.typescript.createLanguageService(this, typescript.createDocumentRegistry());
		this.stringUtil = new StringUtil();
		this.typeUtil = new TypeUtil();
		this.tokenSerializer = new TokenSerializer();
		this.tokenPredicator = new TokenPredicator(this.stringUtil);
		this.nameGetter = new NameGetter(marshaller);
		this.sourceFilePropertiesGetter = new SourceFilePropertiesGetter();
		this.typeExpressionGetter = new TypeExpressionGetter(this.nameGetter, this.tokenSerializer);
		this.heritageClauseFormatter = new HeritageClauseFormatter(this.typeExpressionGetter);
		this.valueExpressionGetter = new ValueExpressionGetter(marshaller, this.heritageClauseFormatter, this.sourceFilePropertiesGetter, this.typeExpressionGetter, this.nameGetter, this.tokenSerializer, this.tokenPredicator, this.stringUtil);
		this.mapper = new Mapper();
		this.cache = new Cache(this);
		this.identifierSerializer = new IdentifierSerializer(marshaller, this.stringUtil);
		this.tracer = new Tracer(this, this.nameGetter, this.sourceFilePropertiesGetter);
		this.valueResolvedGetter = new ValueResolvedGetter(marshaller, this.tracer, this.identifierSerializer, this.tokenPredicator, this.stringUtil);
		this.modifiersFormatter = new ModifiersFormatter(this.tokenSerializer);
		this.variableFormatter = new VariableFormatter(this.valueExpressionGetter, this.sourceFilePropertiesGetter, this.nameGetter, this.mapper, this.cache, this.tracer, this.valueResolvedGetter, this.modifiersFormatter, this.typeExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.decoratorsFormatter = new DecoratorsFormatter(this.mapper, this.nameGetter);
		this.propFormatter = new PropFormatter(this.mapper, this.tracer, this.modifiersFormatter, this.decoratorsFormatter, this.sourceFilePropertiesGetter, this.valueExpressionGetter, this.valueResolvedGetter, this.typeExpressionGetter, this.nameGetter, this.tokenSerializer, this.typeUtil);
		this.parametersFormatter = new ParametersFormatter(this.mapper, this.tracer, this.nameGetter, this.typeExpressionGetter, this.valueResolvedGetter, this.valueExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.argumentsFormatter = new ArgumentsFormatter(this.mapper, this.tracer, this.valueResolvedGetter, this.valueExpressionGetter);
		this.methodFormatter = new MethodFormatter(this.tracer, this.nameGetter, this.valueExpressionGetter, this.valueResolvedGetter, this.sourceFilePropertiesGetter, this.decoratorsFormatter, this.modifiersFormatter, this.parametersFormatter);
		this.constructorFormatter = new ConstructorFormatter(this.mapper, this.sourceFilePropertiesGetter, this.decoratorsFormatter, this.modifiersFormatter, this.parametersFormatter);
		this.functionFormatter = new FunctionFormatter(this.mapper, this.tracer, this.cache, this.nameGetter, this.valueExpressionGetter, this.valueResolvedGetter, this.sourceFilePropertiesGetter, this.decoratorsFormatter, this.modifiersFormatter, this.parametersFormatter);
		this.classFormatter = new ClassFormatter(this.mapper, this.cache, this.decoratorsFormatter, this.propFormatter, this.methodFormatter, this.constructorFormatter, this.modifiersFormatter, this.heritageClauseFormatter, this.sourceFilePropertiesGetter);
		this.callExpressionFormatter = new CallExpressionFormatter(this.mapper, this.argumentsFormatter, this.sourceFilePropertiesGetter, this.tracer, this.valueExpressionGetter, this.valueResolvedGetter, this.nameGetter, this.typeExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.newExpressionFormatter = new NewExpressionFormatter(this.mapper, this.argumentsFormatter, this.sourceFilePropertiesGetter, this.tracer, this.valueExpressionGetter, this.valueResolvedGetter, this.nameGetter, this.typeExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.enumFormatter = new EnumFormatter(this.mapper, this.cache, this.nameGetter, this.sourceFilePropertiesGetter, this.decoratorsFormatter);
		this.importFormatter = new ImportFormatter(this, this.sourceFilePropertiesGetter, this.nameGetter, this.callExpressionFormatter, this.variableFormatter, this.mapper, this.tracer, this.stringUtil);
		this.exportFormatter = new ExportFormatter(this, this.mapper, this.valueExpressionGetter, this.valueResolvedGetter, this.sourceFilePropertiesGetter, this.variableFormatter, this.classFormatter, this.functionFormatter, this.nameGetter, this.tracer, this.stringUtil);
	}

	/**
	 * Adds a new file to the LanguageService.
	 * @param {string} fileName
	 * @param {string} content
	 * @param {number} [version=0]
	 * @returns {NodeArray<Statement>}
	 */
	public addFile (fileName: string, content: string, version: number = 0): NodeArray<Statement> {
		// TODO: Make sure to add an extension here! Otherwise, Typescript won't add the file.
		this.files.set(fileName, {version, content});
		return this.getFile(fileName);
	}

	/**
	 * Gets the Statements associated with the given filename.
	 * @param {string} fileName
	 * @returns {NodeArray<Statement>}
	 */
	public getFile (fileName: string): NodeArray<Statement> {
		let file = this.languageService.getProgram().getSourceFile(fileName);
		if (file == null) throw new ReferenceError(`${this.getFile.name} could not find file: '${fileName}' through the service. Have you added it to the service?`);
		return file.statements;
	}

	/**
	 * Gets the settings that Typescript will generate an AST from. There isn't much reason to make
	 * anything but the libs developer-facing since we only support ES2015 modules.
	 * @returns {CompilerOptions}
	 */
	public getCompilationSettings (): CompilerOptions {
		return {
			target: ScriptTarget.ES2017,
			module: ModuleKind.ES2015,
			lib: this.config.lib != null && this.config.lib.length > 0
				? this.config.lib
				: ["es2015.promise", "dom", "es6", "scripthost", "es7", "es2017.object", "es2015.proxy"]
		};
	}

	/**
	 * Gets the names of each file that has been added to the "program".
	 * @returns {string[]}
	 */
	public getScriptFileNames (): string[] {
		return [...this.files.keys()];
	}

	/**
	 * Gets the last version of the given fileName. Each time a file changes, the version number will be updated,
	 * so this can be useful to figure out if the file has changed since the program was run initially.
	 * @param {string} fileName
	 * @returns {string}
	 */
	public getScriptVersion (fileName: string): string {
		const script = this.files.get(fileName);
		if (script == null) return "-1";
		return script.version.toString();
	}

	public getFileVersion (filePath: string): number {
		const version = this.getScriptVersion(filePath);
		return parseInt(version);
	}

	/**
	 * Gets the last registered IScriptSnapshot, if any, otherwise undefined.
	 * @param {string} fileName
	 * @returns {IScriptSnapshot?}
	 */
	public getScriptSnapshot (fileName: string): IScriptSnapshot | undefined {
		const file = this.files.get(fileName);
		if (file == null) return undefined;
		return this.typescript.ScriptSnapshot.fromString(file.content);
	}

	/**
	 * Gets the current directory.
	 * @returns {string}
	 */
	public getCurrentDirectory (): string {
		return process.cwd();
	}

	/**
	 * Gets the default filepath for Typescript's lib-files.
	 * @param {CompilerOptions} options
	 * @returns {string}
	 */
	public getDefaultLibFileName (options: CompilerOptions): string {
		return this.typescript.getDefaultLibFilePath(options);
	}

	/**
	 *Formats the given Statement into an ICallExpression.
	 * @param {Statement|Expression} statement
	 * @returns {ICallExpression}
	 */
	private getCallExpression (statement: Statement | Expression): ICallExpression {
		if (isCallExpression(statement)) {
			return this.callExpressionFormatter.format(statement);
		}

		if (isExpressionStatement(statement)) {
			return this.getCallExpression(statement.expression);
		}
		throw new TypeError(`${this.getCallExpression.name} could not format a CallExpression of kind ${SyntaxKind[statement.kind]}`);
	}

	/**
	 *Formats the given Statement into an INewExpression.
	 * @param {Statement|Expression} statement
	 * @returns {INewExpression}
	 */
	private getNewExpression (statement: Statement | Expression): INewExpression {
		if (isNewExpression(statement)) {
			return this.newExpressionFormatter.format(statement);
		}
		throw new TypeError(`${this.getNewExpression.name} could not format a NewExpression of kind ${SyntaxKind[statement.kind]}`);
	}

	/**
	 * Gets and formats all CallExpressions associated with the given file.
	 * These hold information such as the arguments the members are invoked with, generic type
	 * arguments and such.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ICallExpression[]}
	 */
	public getCallExpressionsForFile (fileName: string, deep: boolean = false): ICallExpression[] {
		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getCallExpressionsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getCallExpressions(statements, deep);
	}

	/**
	 * Gets and formats all CallExpressions associated with the given statements.
	 * These hold information such as the arguments the members are invoked with, generic type
	 * arguments and such.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ICallExpression[]}
	 */
	public getCallExpressions (statements: (Statement | Expression | Node)[], deep: boolean = false): ICallExpression[] {
		const expressions: ICallExpression[] = [];

		statements.forEach(statement => {
			if (this.isResolvingStatement(statement)) return;

			if (isCallExpression(statement) || isExpressionStatement(statement)) {
				this.setResolvingStatement(statement);
				expressions.push(this.getCallExpression(statement));
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherCallExpressions = this.getCallExpressions(this.findChildStatements(statement), deep);
				otherCallExpressions.forEach(exp => expressions.push(exp));
			}

		});
		return expressions;
	}

	/**
	 * Gets and formats all NewExpressions associated with the given file.
	 * These hold information such as the arguments the constructor is invoked with, generic type
	 * arguments and such.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {INewExpression[]}
	 */
	public getNewExpressionsForFile (fileName: string, deep: boolean = false): INewExpression[] {
		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getNewExpressionsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getNewExpressions(statements, deep);
	}

	/**
	 * Gets and formats all NewExpressions associated with the given statements.
	 * These hold information such as the arguments the constructor is invoked with, generic type
	 * arguments and such.
	 * @param {(Statement | Expression | Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {INewExpression[]}
	 */
	public getNewExpressions (statements: (Statement | Expression | Node)[], deep: boolean = false): INewExpression[] {
		const expressions: INewExpression[] = [];

		statements.forEach(statement => {
			if (this.isResolvingStatement(statement)) return;

			if (isExpressionStatement(statement) && isNewExpression(statement.expression)) {
				this.setResolvingStatement(statement);
				expressions.push(this.getNewExpression(statement.expression));
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherNewExpressions = this.getNewExpressions(this.findChildStatements(statement), deep);
				otherNewExpressions.forEach(exp => expressions.push(exp));
			}

		});
		return expressions;
	}

	/**
	 * Gets the member name for call expression.
	 * @param {CallExpression} statement
	 * @returns {string}
	 */
	private getCallExpressionMemberName (statement: CallExpression): string {
		if (isIdentifierObject(statement.expression)) return statement.expression.text;
		throw new TypeError(`${this.getCallExpressionMemberName.name} could not get the name for an expression!`);
	}

	/**
	 * Gets all function declarations (if any) that occurs in the given file
	 * and returns them in a FunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {FunctionIndexer}
	 */
	public getFunctionDeclarationsForFile (fileName: string, deep: boolean = false): FunctionIndexer {
		const cached = this.cache.getCachedFunctionIndexer(fileName);
		if (cached != null && !this.cache.cachedFunctionIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getFunctionDeclarationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);

		const declarations = this.getFunctionDeclarations(statements, deep);
		this.cache.setCachedFunctionIndexer(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets all function declarations (if any) that occurs in the given array of statements
	 * and returns them in a FunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {FunctionIndexer}
	 */
	public getFunctionDeclarations (statements: (Statement | Expression | Node)[], deep: boolean = false): FunctionIndexer {
		const functionIndexer: FunctionIndexer = {};

		for (const statement of statements) {
			if (this.isResolvingStatement(statement)) continue;

			if (isFunctionDeclaration(statement)) {
				this.setResolvingStatement(statement);
				const formatted = this.functionFormatter.format(statement);
				Object.assign(functionIndexer, {[formatted.name]: formatted});
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherDeclarations = this.getFunctionDeclarations(this.findChildStatements(statement), deep);
				Object.keys(otherDeclarations).forEach(key => {
					// Only assign the deep function to the functionIndexer if there isn't a match in the scope above it.
					if (functionIndexer[key] == null) Object.assign(functionIndexer, {[key]: otherDeclarations[key]});
				});
			}

		}
		Object.defineProperty(functionIndexer, "___kind", {
			value: IdentifierMapKind.FUNCTION_INDEXER,
			enumerable: false
		});
		return functionIndexer;
	}

	/**
	 * Gets all enum declarations (if any) that occurs in the given file
	 * and returns them in a EnumIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {EnumIndexer}
	 */
	public getEnumDeclarationsForFile (fileName: string, deep: boolean = false): EnumIndexer {
		const cached = this.cache.getCachedEnumIndexer(fileName);
		if (cached != null && !this.cache.cachedEnumIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getEnumDeclarationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const declarations = this.getEnumDeclarations(statements, deep);

		this.cache.setCachedEnumIndexer(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets all enum declarations (if any) that occurs in the given array of statements
	 * and returns them in a EnumIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {EnumIndexer}
	 */
	public getEnumDeclarations (statements: (Statement | Expression | Node)[], deep: boolean = false): EnumIndexer {
		const enumIndexer: EnumIndexer = {};

		for (const statement of statements) {
			if (this.isResolvingStatement(statement)) continue;
			if (isEnumDeclaration(statement)) {
				this.setResolvingStatement(statement);
				const formatted = this.enumFormatter.format(statement);
				Object.assign(enumIndexer, {[formatted.name]: formatted});
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherDeclarations = this.getEnumDeclarations(this.findChildStatements(statement), deep);
				Object.keys(otherDeclarations).forEach(key => {
					// Only assign the deep declaration to the enumIndexer if there isn't a match in the scope above it.
					if (enumIndexer[key] == null) Object.assign(enumIndexer, {[key]: otherDeclarations[key]});
				});
			}

		}
		Object.defineProperty(enumIndexer, "___kind", {
			value: IdentifierMapKind.ENUM_INDEXER,
			enumerable: false
		});

		return enumIndexer;
	}

	/**
	 * Gets all identifiers (such as variables, functions, classes, enums, imports, exports, etc) (if any) that occurs in the given file
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IIdentifierMap}
	 */
	public getAllIdentifiersForFile (fileName: string, deep: boolean = false): IIdentifierMap {
		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getAllIdentifiersForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getAllIdentifiers(statements, deep);
	}

	/**
	 * Gets all identifiers (such as variables, functions, classes, enums, imports, exports, etc) (if any) that occurs in the given array of statements
	 * and returns them in a IIdentifierMap. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IIdentifierMap}
	 */
	public getAllIdentifiers (statements: (Statement | Expression | Node)[], deep: boolean = false): IIdentifierMap {

		const map: IIdentifierMap = {
			___kind: IdentifierMapKind.IDENTIFIER_MAP,
			enums: this.getEnumDeclarations(statements, deep),
			variables: this.getVariableAssignments(statements, deep),
			classes: this.getClassDeclarations(statements, deep),
			functions: this.getFunctionDeclarations(statements, deep),
			imports: this.getImportDeclarations(statements, deep),
			exports: this.getExportDeclarations(statements),
			callExpressions: this.getCallExpressions(statements, deep)
		};

		// Make the kind non-enumerable.
		Object.defineProperty(map, "___kind", {
			value: IdentifierMapKind.IDENTIFIER_MAP,
			enumerable: false
		});

		return map;
	}

	/**
	 * Gets all variable assignments (if any) that occurs in the given file
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {VariableIndexer}
	 */
	public getVariableAssignmentsForFile (fileName: string, deep: boolean = false): VariableIndexer {
		const cached = this.cache.getCachedVariableIndexer(fileName);
		if (cached != null && !this.cache.cachedVariableIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getVariableAssignmentsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const assignments = this.getVariableAssignments(statements, deep);
		this.cache.setCachedVariableIndexer(fileName, assignments);
		return assignments;
	}

	private isResolvingStatement (statement: Statement | Expression | Node): boolean {
		return SimpleLanguageService.RESOLVING_STATEMENTS.has(statement);
	}

	private setResolvingStatement (statement: Statement | Expression | Node): void {
		SimpleLanguageService.RESOLVING_STATEMENTS.add(statement);
	}

	private removeResolvingStatement (statement: Statement | Expression | Node): void {
		SimpleLanguageService.RESOLVING_STATEMENTS.delete(statement);
	}

	/**
	 * Gets all variable assignments (if any) that occurs in the given array of statements
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {VariableIndexer}
	 */
	public getVariableAssignments (statements: (Statement | Expression | Node)[], deep: boolean = false): VariableIndexer {
		const assignmentMap: VariableIndexer = {};

		for (const statement of statements) {
			if (this.isResolvingStatement(statement)) continue;

			if (isVariableStatement(statement) || isVariableDeclarationList(statement) || isVariableDeclaration(statement)) {
				this.setResolvingStatement(statement);
				Object.assign(assignmentMap, this.variableFormatter.format(statement));
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherAssignments = this.getVariableAssignments(this.findChildStatements(statement), deep);
				Object.keys(otherAssignments).forEach(key => {
					// Only assign the deep variable to the assignmentMap if there isn't a match in the scope above it.
					if (assignmentMap[key] == null) Object.assign(assignmentMap, {[key]: otherAssignments[key]});
				});
			}

		}
		return assignmentMap;
	}

	/**
	 * Finds all "children" of the given statement, if it has any.
	 * @param {Statement|Expression} statement
	 * @returns {(Statement|Declaration)[]}
	 */
	private findChildStatements (statement: Statement | Expression | Declaration | Node): (Statement | Declaration)[] {

		if (isIfStatement(statement)) {
			return this.findChildStatements(statement.thenStatement);
		}

		if (isShorthandPropertyAssignment(statement)) {
			return statement.objectAssignmentInitializer == null ? [] : this.findChildStatements(statement.objectAssignmentInitializer);
		}

		if (isDefaultClause(statement) || isCaseClause(statement)) {
			const statements: (Statement | Declaration)[] = [];

			statement.statements.forEach(child => {
				this.findChildStatements(child).forEach(childStatement => statements.push(childStatement));
			});

			return statements;
		}

		if (isWhileStatement(statement)) {
			return this.findChildStatements(statement.statement);
		}

		if (isExportAssignment(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isParenthesizedExpression(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isCaseBlock(statement)) {
			const statements: (Statement | Declaration)[] = [];

			statement.clauses.forEach(clause => {
				this.findChildStatements(clause).forEach(childStatement => statements.push(childStatement));
			});

			return statements;
		}

		if (isAwaitExpression(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isSwitchStatement(statement)) {
			return this.findChildStatements(statement.caseBlock);
		}

		if (isBlockDeclaration(statement)) {
			return statement.statements;
		}

		if (isReturnStatement(statement)) {
			return statement.expression == null ? [] : this.findChildStatements(statement.expression);
		}

		if (isArrowFunction(statement)) {
			return this.findChildStatements(statement.body);
		}

		if (isLabeledStatement(statement)) {
			return this.findChildStatements(statement.statement);
		}

		if (isConditionalExpression(statement)) {
			const whenTrue = this.findChildStatements(statement.whenTrue);
			const whenFalse = this.findChildStatements(statement.whenFalse);
			return [...whenTrue, ...whenFalse];
		}

		if (isBinaryExpression(statement)) {
			const left = this.findChildStatements(statement.left);
			const right = this.findChildStatements(statement.right);
			return [...left, ...right];
		}

		if (isFunctionDeclaration(statement)) {
			return statement.body == null ? [] : this.findChildStatements(statement.body);
		}

		if (isExpressionStatement(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isTryStatement(statement)) {
			const tryBlock = this.findChildStatements(statement.tryBlock);
			const catchClause = statement.catchClause == null ? [] : this.findChildStatements(statement.catchClause.block);
			const finallyBlock = statement.finallyBlock == null ? [] : this.findChildStatements(statement.finallyBlock);

			return [...tryBlock, ...catchClause, ...finallyBlock];
		}

		if (isSpreadAssignment(statement) || isSpreadElement(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isVariableStatement(statement)) {
			const statements: (Statement | Declaration)[] = [];

			statement.declarationList.declarations.forEach(declaration => {
				this.findChildStatements(declaration).forEach(childStatement => statements.push(childStatement));
			});
			return statements;
		}

		if (isVariableDeclarationList(statement)) {
			const list: Declaration[] = [];
			statement.declarations.forEach(declaration => list.push(declaration));
			return list;
		}

		if (isVariableDeclaration(statement)) {
			return statement.initializer == null ? [] : this.findChildStatements(statement.initializer);
		}

		if (isElementAccessExpression(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isPropertyAccessExpression(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isPrefixUnaryExpression(statement)) {
			return this.findChildStatements(statement.operand);
		}

		if (isPostfixUnaryExpression(statement)) {
			return this.findChildStatements(statement.operand);
		}

		if (isFunctionExpression(statement)) {
			return this.findChildStatements(statement.body);
		}

		if (isTypeOfExpression(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isMethodDeclaration(statement)) {
			return statement.body == null ? [] : this.findChildStatements(statement.body);
		}

		if (isTemplateExpression(statement)) {
			const statements: (Statement | Declaration)[] = [];

			statement.templateSpans.forEach(span => {
				this.findChildStatements(span.expression).forEach(childStatement => statements.push(childStatement));
			});

			return statements;
		}

		if (isObjectLiteralExpression(statement)) {
			const statements: (Statement | Declaration)[] = [];

			statement.properties.forEach(property => {
				this.findChildStatements(property).forEach(childStatement => statements.push(childStatement));
			});

			return statements;
		}

		if (isPropertyAssignment(statement)) {
			return this.findChildStatements(statement.initializer);
		}

		if (isConstructorDeclaration(statement)) {
			return statement.body == null ? [] : this.findChildStatements(statement.body);
		}

		if (isArrayLiteralExpression(statement)) {
			const statements: (Statement | Declaration)[] = [];

			statement.elements.forEach(element => {
				this.findChildStatements(element).forEach(childStatement => statements.push(childStatement));
			});

			return statements;
		}

		if (isPropertyDeclaration(statement)) {
			return statement.initializer == null ? [] : this.findChildStatements(statement.initializer);
		}

		if (isClassExpression(statement) || isClassDeclaration(statement)) {
			const statements: (Statement | Declaration)[] = [];

			statement.members.forEach(member => {
				this.findChildStatements(member).forEach(childStatement => statements.push(childStatement));
			});

			return statements;
		}

		if (isForStatement(statement)) {
			const initializer = statement.initializer == null ? [] : this.findChildStatements(statement.initializer);
			const body = this.findChildStatements(statement.statement);
			return [...initializer, ...body];
		}

		if (isForInStatement(statement)) {
			const initializer = this.findChildStatements(statement.initializer);
			const body = this.findChildStatements(statement.statement);
			return [...initializer, ...body];
		}

		if (isForOfStatement(statement)) {
			const initializer = this.findChildStatements(statement.initializer);
			const body = this.findChildStatements(statement.statement);
			return [...initializer, ...body];
		}

		if (isTypeAssertionExpression(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isDoStatement(statement)) {
			return this.findChildStatements(statement.expression);
		}

		if (isEnumDeclaration(statement)) {
			return [];
		}

		if (isImportDeclaration(statement)) {
			return [];
		}

		if (isImportEqualsDeclaration(statement)) {
			return [];
		}

		if (isEmptyStatement(statement)) {
			return [];
		}

		if (isDeleteExpression(statement)) {
			return [];
		}

		if (isThisKeyword(statement)) {
			return [];
		}

		if (isBreakStatement(statement)) {
			return [];
		}

		if (isThrowStatement(statement)) {
			return [];
		}

		if (isContinueStatement(statement)) {
			return [];
		}

		if (isNewExpression(statement)) {
			return [];
		}

		if (isNullKeyword(statement)) {
			return [];
		}

		if (isUndefinedKeyword(statement)) {
			return [];
		}

		if (isIdentifierObject(statement)) {
			return [];
		}

		if (isCallExpression(statement)) {
			return [];
		}

		if (isRegularExpressionLiteral(statement)) {
			return [];
		}

		if (isStringLiteral(statement)) {
			return [];
		}

		if (isNumericLiteral(statement)) {
			return [];
		}

		if (isFirstLiteralToken(statement)) {
			return [];
		}

		if (isTrueKeyword(statement)) {
			return [];
		}

		if (isFalseKeyword(statement)) {
			return [];
		}

		if (isLiteralToken(statement)) {
			return [];
		}

		if (isTemplateToken(statement)) {
			return [];
		}

		throw new TypeError(`${this.findChildStatements.name} could not find child statements for a statement of kind ${SyntaxKind[statement.kind]} around here: ${this.sourceFilePropertiesGetter.getSourceFileProperties(statement).fileContents.slice(statement.pos, statement.end)}`);
		// return [];
	}

	/**
	 * Gets all class declarations (if any) that occurs in the given file
	 * and returns them as a ClassIndexer.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ClassIndexer}
	 */
	public getClassDeclarationsForFile (fileName: string, deep: boolean = false): ClassIndexer {
		const cached = this.cache.getCachedClassIndexer(fileName);
		if (cached != null && !this.cache.cachedClassIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getClassDeclarationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const declarations = this.getClassDeclarations(statements, deep);

		Object.keys(declarations).forEach(key => this.cache.setCachedClass(fileName, declarations[key]));

		this.cache.setCachedClassIndexer(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets all class declarations (if any) that occurs in the given array of statements
	 * and returns them as a ClassIndexer.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ClassIndexer}
	 */
	public getClassDeclarations (statements: (Statement | Expression | Node)[], deep: boolean = false): ClassIndexer {
		const declarations: ClassIndexer = {};
		for (const statement of statements) {
			if (this.isResolvingStatement(statement)) continue;

			if (isClassDeclaration(statement)) {
				this.setResolvingStatement(statement);
				const declaration = this.getClassDeclaration(statement);
				declarations[declaration.name] = declaration;
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherDeclarations = this.getClassDeclarations(this.findChildStatements(statement), deep);
				Object.keys(otherDeclarations).forEach(key => {
					// Only assign the deep class to the declarations if there isn't a match in the scope above it.
					if (declarations[key] == null) Object.assign(declarations, {[key]: otherDeclarations[key]});
				});
			}
		}
		Object.defineProperty(declarations, "___kind", {
			value: IdentifierMapKind.CLASS_INDEXER,
			enumerable: false
		});
		return declarations;
	}

	/**
	 * Gets and returns all ImportDeclarations (if any) that occur in the given file
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IImportDeclaration[]}
	 */
	public getImportDeclarationsForFile (fileName: string, deep: boolean = false): IImportDeclaration[] {
		const cached = this.cache.getCachedModuleDependencies(fileName);
		if (cached != null && !this.cache.cachedModuleDependenciesNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getImportDeclarationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const declarations = this.getImportDeclarations(statements, deep);

		this.cache.setCachedModuleDependencies(fileName, declarations);
		return declarations;
	}

	/**
	 * Gets and returns all ImportDeclarations (if any) that occur in the given array of statements.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IImportDeclaration[]}
	 */
	public getImportDeclarations (statements: (Statement | Expression | Node)[], deep: boolean = false): IImportDeclaration[] {
		const declarations: IImportDeclaration[] = [];
		for (const statement of statements) {
			if (this.isResolvingStatement(statement)) continue;

			if (isImportDeclaration(statement) || isImportEqualsDeclaration(statement) || isVariableStatement(statement)) {
				this.setResolvingStatement(statement);
				const declaration = this.getImportDeclaration(statement);
				if (declaration != null) declarations.push(declaration);
				this.removeResolvingStatement(statement);
			}

			if (isExpressionStatement(statement) && isCallExpression(statement.expression)) {
				this.setResolvingStatement(statement);
				const declaration = this.getImportDeclaration(statement.expression);
				if (declaration != null) declarations.push(declaration);
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherImportDeclarations = this.getImportDeclarations(this.findChildStatements(statement), deep);
				otherImportDeclarations.forEach(declaration => declarations.push(declaration));
			}
		}

		Object.defineProperty(declarations, "___kind", {
			value: IdentifierMapKind.MODULE_DEPENDENCIES,
			enumerable: false
		});
		return declarations;
	}

	/**
	 * If given an ImportDeclaration|ImportEqualsDeclaration, a formatted IImportDeclaration will be returned holding the relative and full import-path
	 * as well as any bindings that will live in the local scope of the given file.
	 * @param {ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression} statement
	 * @returns {IImportDeclaration}
	 */
	private getImportDeclaration (statement: ImportDeclaration | ImportEqualsDeclaration | VariableStatement | CallExpression): IImportDeclaration | null {
		return this.importFormatter.format(statement);
	}

	/**
	 * Gets all ExportDeclarations (if any) that occur in the given file and returns a Set
	 * of all the identifiers that are being exported.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getExportDeclarationsForFile (fileName: string, deep: boolean = false): IExportDeclaration[] {
		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getExportDeclarationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getExportDeclarations(statements, deep);
	}

	/**
	 * Gets all ExportDeclarations (if any) that occur in the given array of statements and returns an array
	 * of IExportDeclarations.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getExportDeclarations (statements: (Statement | Expression | Node)[], deep: boolean = false): IExportDeclaration[] {
		const declarations: IExportDeclaration[] = [];
		for (const statement of statements) {

			if (this.isResolvingStatement(statement)) continue;

			if (
				isExportDeclaration(statement) ||
				isExportAssignment(statement) ||
				isVariableStatement(statement) ||
				isFunctionDeclaration(statement) ||
				isClassDeclaration(statement)
			) {
				this.setResolvingStatement(statement);
				const declaration = this.getExportDeclaration(statement);
				if (declaration != null) declarations.push(declaration);
				this.removeResolvingStatement(statement);
			}

			if (deep) {
				const otherExportDeclarations = this.getExportDeclarations(this.findChildStatements(statement), deep);
				otherExportDeclarations.forEach(declaration => declarations.push(declaration));
			}
		}
		return declarations;
	}

	private getExportDeclaration (statement: ExportDeclaration | VariableStatement | ExportAssignment | FunctionDeclaration | ClassDeclaration): IExportDeclaration | null {
		return this.exportFormatter.format(statement);
	}

	/**
	 * Gets a class declaration, including its methods, positions, which class it derives from,
	 * props and constructor parameters.
	 * @param {Statement|Declaration|Expression|Node} statement
	 * @returns {IClassDeclaration}
	 */
	private getClassDeclaration (statement: ClassDeclaration): IClassDeclaration {
		return this.classFormatter.format(statement);
	}

}