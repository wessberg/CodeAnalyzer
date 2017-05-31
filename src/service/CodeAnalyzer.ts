import {IFileLoader} from "@wessberg/fileloader";
import {IMarshaller} from "@wessberg/marshaller";
import * as typescript from "typescript";
import {ArrowFunction, BinaryExpression, CallExpression, ClassDeclaration, CompilerOptions, Declaration, ExportAssignment, ExportDeclaration, Expression, ExpressionStatement, FunctionDeclaration, ImportDeclaration, ImportEqualsDeclaration, IScriptSnapshot, LanguageService, ModuleKind, Node, NodeArray, ScriptTarget, Statement, SyntaxKind, VariableStatement} from "typescript";
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
import {ISourceFilePropertiesGetter} from "../getter/interface/ISourceFilePropertiesGetter";
import {ITypeExpressionGetter} from "../getter/interface/ITypeExpressionGetter";
import {IValueExpressionGetter} from "../getter/interface/IValueExpressionGetter";
import {IValueResolvedGetter} from "../getter/interface/IValueResolvedGetter";
import {NameGetter} from "../getter/NameGetter";
import {SourceFilePropertiesGetter} from "../getter/SourceFilePropertiesGetter";
import {TypeExpressionGetter} from "../getter/TypeExpressionGetter";
import {ValueExpressionGetter} from "../getter/ValueExpressionGetter";
import {ValueResolvedGetter} from "../getter/ValueResolvedGetter";
import {IMapper} from "../mapper/interface/IMapper";
import {Mapper} from "../mapper/Mapper";
import {ITokenPredicator} from "../predicate/interface/ITokenPredicator";
import {isArrayLiteralExpression, isArrowFunction, isAwaitExpression, isBinaryExpression, isBlockDeclaration, isBreakStatement, isCallExpression, isCaseBlock, isCaseClause, isClassDeclaration, isClassExpression, isConditionalExpression, isConstructorDeclaration, isContinueStatement, isDefaultClause, isDeleteExpression, isDoStatement, isElementAccessExpression, isEmptyStatement, isEnumDeclaration, isExportAssignment, isExportDeclaration, isExpressionStatement, isFalseKeyword, isFirstLiteralToken, isForInStatement, isForOfStatement, isForStatement, isFunctionDeclaration, isFunctionExpression, isIdentifierObject, isIEnumDeclaration, isIExportableIIdentifier, isIfStatement, isILiteralValue, isImportDeclaration, isImportEqualsDeclaration, isLabeledStatement, isLiteralToken, isMethodDeclaration, isNewExpression, isNullKeyword, isNumericLiteral, isObjectLiteralExpression, isParameterDeclaration, isParenthesizedExpression, isPostfixUnaryExpression, isPrefixUnaryExpression, isPropertyAccessExpression, isPropertyAssignment, isPropertyDeclaration, isRegularExpressionLiteral, isReturnStatement, isShorthandPropertyAssignment, isSpreadAssignment, isSpreadElement, isStringLiteral, isSwitchStatement, isTemplateExpression, isTemplateToken, isThisKeyword, isThrowStatement, isTrueKeyword, isTryStatement, isTypeAssertionExpression, isTypeOfExpression, isUndefinedKeyword, isVariableDeclaration, isVariableDeclarationList, isVariableStatement, isWhileStatement} from "../predicate/PredicateFunctions";
import {TokenPredicator} from "../predicate/TokenPredicator";
import {ITokenSerializer} from "../serializer/interface/ITokenSerializer";
import {TokenSerializer} from "../serializer/TokenSerializer";
import {ITracer} from "../tracer/interface/ITracer";
import {Tracer} from "../tracer/Tracer";
import {IStringUtil} from "../util/interface/IStringUtil";
import {ITypeUtil} from "../util/interface/ITypeUtil";
import {StringUtil} from "../util/StringUtil";
import {TypeUtil} from "../util/TypeUtil";
import {ArbitraryValue, ClassIndexer, EnumIndexer, FunctionIndexer, IArrowFunction, ICallExpression, IClassDeclaration, ICodeAnalyzer, IdentifierMapKind, IExportDeclaration, IIdentifierMap, IImportDeclaration, IMutationDeclaration, INewExpression, ResolvedIIdentifierValueMap, ResolvedIIdentifierValueMapIndexer, ResolvedSerializedIIdentifierValueMap, ResolvedSerializedIIdentifierValueMapIndexer, VariableIndexer} from "./interface/ICodeAnalyzer";
import {IMutationFormatter} from "../formatter/interface/IMutationFormatter";
import {MutationFormatter} from "../formatter/MutationFormatter";
import {IRequireFormatter} from "../formatter/interface/IRequireFormatter";
import {RequireFormatter} from "../formatter/RequireFormatter";
import {IValueableFormatter} from "../formatter/interface/IValueableFormatter";
import {ValueableFormatter} from "../formatter/ValueableFormatter";
import {IArrowFunctionFormatter} from "../formatter/interface/IArrowFunctionFormatter";
import {ArrowFunctionFormatter} from "../formatter/ArrowFunctionFormatter";
import {IPathValidator, PathValidator} from "@wessberg/compiler-common";

/**
 * A service that parses and reflects on the AST generated by Typescript's language service.
 * With it, we can extract metadata such as initialization values and types, arguments and import
 * declarations.
 * @author Frederik Wessberg
 */
export class CodeAnalyzer implements ICodeAnalyzer {
	private static readonly RESOLVING_STATEMENTS: Set<Statement|Expression|Node> = new Set();
	private readonly pathValidator: IPathValidator = new PathValidator();
	private static readonly SKIP_KINDS: Set<SyntaxKind> = new Set([
		SyntaxKind.InterfaceDeclaration,
		SyntaxKind.InterfaceKeyword,
		SyntaxKind.NamespaceKeyword,
		SyntaxKind.DeclareKeyword
	]);

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
	private mutationFormatter: IMutationFormatter;
	private requireFormatter: IRequireFormatter;
	private valueableFormatter: IValueableFormatter;
	private arrowFunctionFormatter: IArrowFunctionFormatter;
	private tokenSerializer: ITokenSerializer;
	private stringUtil: IStringUtil;
	private tokenPredicator: ITokenPredicator;
	private typeUtil: ITypeUtil;
	private files: Map<string, { version: number, content: string }> = new Map();
	constructor (private marshaller: IMarshaller,
							 private fileLoader: IFileLoader) {
		this.languageService = typescript.createLanguageService(this, typescript.createDocumentRegistry());
		this.typeUtil = new TypeUtil();
		this.tokenSerializer = new TokenSerializer();
		this.tokenPredicator = new TokenPredicator();
		this.stringUtil = new StringUtil(marshaller);
		this.nameGetter = new NameGetter(marshaller);
		this.sourceFilePropertiesGetter = new SourceFilePropertiesGetter();
		this.typeExpressionGetter = new TypeExpressionGetter(this.nameGetter, this.tokenSerializer);
		this.mapper = new Mapper();
		this.cache = new Cache(this);
		this.tracer = new Tracer(this, this.cache, this.typeExpressionGetter, this.mapper, this.nameGetter, this.sourceFilePropertiesGetter);
		this.heritageClauseFormatter = new HeritageClauseFormatter(this.tracer, this.typeExpressionGetter);
		this.valueExpressionGetter = new ValueExpressionGetter(marshaller, this.heritageClauseFormatter, this.sourceFilePropertiesGetter, this.nameGetter, this.tokenSerializer, this.tokenPredicator, this.stringUtil);
		this.valueResolvedGetter = new ValueResolvedGetter(this.mapper, this.marshaller, this.tracer, this.tokenPredicator);
		this.valueableFormatter = new ValueableFormatter(this.valueExpressionGetter, this.valueResolvedGetter);
		this.modifiersFormatter = new ModifiersFormatter(this.tokenSerializer);
		this.variableFormatter = new VariableFormatter(this.sourceFilePropertiesGetter, this.nameGetter, this.mapper, this.cache, this.valueableFormatter, this.modifiersFormatter, this.typeExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.decoratorsFormatter = new DecoratorsFormatter(this.mapper, this.nameGetter);
		this.propFormatter = new PropFormatter(this.mapper, this.tracer, this.modifiersFormatter, this.decoratorsFormatter, this.sourceFilePropertiesGetter, this.valueExpressionGetter, this.valueResolvedGetter, this.typeExpressionGetter, this.nameGetter, this.tokenSerializer, this.typeUtil);
		this.mutationFormatter = new MutationFormatter(this.mapper, this.valueableFormatter, this.nameGetter, this.valueExpressionGetter, this.valueResolvedGetter, this.sourceFilePropertiesGetter);
		this.parametersFormatter = new ParametersFormatter(this.mapper, this.tracer, this.nameGetter, this.sourceFilePropertiesGetter, this.typeExpressionGetter, this.valueResolvedGetter, this.valueExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.argumentsFormatter = new ArgumentsFormatter(this.mapper, this.valueableFormatter);
		this.methodFormatter = new MethodFormatter(this.nameGetter, this.sourceFilePropertiesGetter, this.decoratorsFormatter, this.modifiersFormatter, this.parametersFormatter, this.valueableFormatter);
		this.constructorFormatter = new ConstructorFormatter(this.mapper, this.sourceFilePropertiesGetter, this.decoratorsFormatter, this.modifiersFormatter, this.parametersFormatter, this.valueableFormatter);
		this.functionFormatter = new FunctionFormatter(this.mapper, this.cache, this.nameGetter, this.sourceFilePropertiesGetter, this.decoratorsFormatter, this.modifiersFormatter, this.parametersFormatter, this.valueableFormatter);
		this.arrowFunctionFormatter = new ArrowFunctionFormatter(this.mapper, this.sourceFilePropertiesGetter, this.decoratorsFormatter, this.modifiersFormatter, this.parametersFormatter, this.valueableFormatter);
		this.classFormatter = new ClassFormatter(this.mapper, this.cache, this.decoratorsFormatter, this.propFormatter, this.methodFormatter, this.constructorFormatter, this.modifiersFormatter, this.valueableFormatter, this.heritageClauseFormatter, this.sourceFilePropertiesGetter);
		this.callExpressionFormatter = new CallExpressionFormatter(this.mapper, this.argumentsFormatter, this.sourceFilePropertiesGetter, this.valueableFormatter, this.nameGetter, this.typeExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.requireFormatter = new RequireFormatter(this, this.mapper, this.sourceFilePropertiesGetter, this.valueableFormatter, this.callExpressionFormatter, this.stringUtil, this.fileLoader);
		this.newExpressionFormatter = new NewExpressionFormatter(this.mapper, this.argumentsFormatter, this.sourceFilePropertiesGetter, this.valueableFormatter, this.nameGetter, this.typeExpressionGetter, this.tokenSerializer, this.typeUtil);
		this.enumFormatter = new EnumFormatter(this.mapper, this.cache, this.nameGetter, this.sourceFilePropertiesGetter, this.decoratorsFormatter);
		this.importFormatter = new ImportFormatter(this, this.sourceFilePropertiesGetter, this.nameGetter, this.requireFormatter, this.mapper, this.tracer, this.stringUtil, fileLoader);
		this.exportFormatter = new ExportFormatter(this, this.mapper, this.sourceFilePropertiesGetter, this.valueableFormatter, this.requireFormatter, this.callExpressionFormatter, this.variableFormatter, this.classFormatter, this.mutationFormatter, this.functionFormatter, this.nameGetter, this.tracer, this.stringUtil, fileLoader);
	}

	/**
	 * Adds a new file to the LanguageService.
	 * @param {string} fileName
	 * @param {string} content
	 * @returns {NodeArray<Statement>}
	 */
	public addFile (fileName: string, content: string): NodeArray<Statement> {

		const filePath = this.importFormatter.resolvePath(fileName);
		const normalizedPath = this.importFormatter.normalizeExtension(filePath);
		const version = this.getFileVersion(normalizedPath) + 1;
		this.files.set(normalizedPath, {version, content});
		return this.getFile(fileName);
	}

	/**
	 * Removes a file from the LanguageService.
	 * @param {string} fileName
	 * @returns {void}
	 */
	public removeFile (fileName: string): void {
		this.files.delete(fileName);
	}

	/**
	 * Parses the given code and returns an array of statements.
	 * @param {string} code
	 * @returns {NodeArray<Statement>}
	 */
	public toAST (code: string): NodeArray<Statement> {
		const temporaryName = `${Math.random() * 100000}.ts`;
		const statements = this.addFile(temporaryName, code);
		this.removeFile(temporaryName);
		return statements;
	}

	/**
	 * Gets the Statements associated with the given filename.
	 * @param {string} fileName
	 * @returns {NodeArray<Statement>}
	 */
	public getFile (fileName: string): NodeArray<Statement> {
		const filePath = this.importFormatter.resolvePath(fileName);
		const normalizedPath = this.importFormatter.normalizeExtension(filePath);
		let file = this.languageService.getProgram().getSourceFile(normalizedPath);
		if (file == null) {
			if (this.fileLoader.existsSync(filePath)) return this.addFile(normalizedPath, this.fileLoader.loadSync(filePath).toString());
			throw new ReferenceError(`${this.getFile.name} could not find file: '${filePath}' through the service. Have you added it to the service?`);
		}
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
			lib: ["es2015.promise", "dom", "es6", "scripthost", "es7", "es2017.object", "es2015.proxy"]
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
	public getScriptSnapshot (fileName: string): IScriptSnapshot|undefined {
		const file = this.files.get(fileName);
		if (file == null) return undefined;
		return typescript.ScriptSnapshot.fromString(file.content);
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
		return typescript.getDefaultLibFilePath(options);
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
		if (this.pathValidator.isBlacklisted(fileName)) return [];

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getCallExpressionsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getCallExpressions(statements, deep);
	}

	/**
	 * Returns true if the given array of statements contains at least statement of the given kind.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {SyntaxKind} kind
	 * @param {boolean} [deep=false]
	 * @returns {boolean}
	 */
	public statementsIncludeKind (statements: (Statement|Expression|Node)[], kind: SyntaxKind, deep: boolean = false): boolean {
		for (const statement of statements) {
			if (statement.kind === kind) return true;
			if (deep) {
				const childMatch = this.statementsIncludeKind(this.findChildStatements(statement), kind, deep);
				if (childMatch) return true;
			}
		}
		return false;
	}

	/**
	 * Gets and formats all CallExpressions associated with the given statements.
	 * These hold information such as the arguments the members are invoked with, generic type
	 * arguments and such.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ICallExpression[]}
	 */
	public getCallExpressions (statements: (Statement|Expression|Node)[], deep: boolean = false): ICallExpression[] {
		const expressions: ICallExpression[] = [];

		statements.forEach(statement => {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) return;

			const actualStatement = deep || isCallExpression(statement) ? statement : isExpressionStatement(statement) && isCallExpression(statement.expression) ? statement.expression : statement;

			if (!this.isResolvingStatement(actualStatement)) {
				if (isCallExpression(actualStatement)) {
					this.setResolvingStatement(actualStatement);
					expressions.push(this.getCallExpression(actualStatement));
					this.removeResolvingStatement(actualStatement);
				}
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
		if (this.pathValidator.isBlacklisted(fileName)) return [];

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
	public getNewExpressions (statements: (Statement|Expression|Node)[], deep: boolean = false): INewExpression[] {
		const expressions: INewExpression[] = [];

		statements.forEach(statement => {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) return;

			if (!this.isResolvingStatement(statement)) {
				if (isExpressionStatement(statement) && isNewExpression(statement.expression)) {
					this.setResolvingStatement(statement);
					expressions.push(this.getNewExpression(statement.expression));
					this.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherNewExpressions = this.getNewExpressions(this.findChildStatements(statement), deep);
				otherNewExpressions.forEach(exp => expressions.push(exp));
			}

		});
		return expressions;
	}

	/**
	 * Gets a map of all identifiers for the given file and their resolved serialized values.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedSerializedIIdentifierValueMap}
	 */
	public getResolvedSerializedIdentifierValuesForFile (fileName: string, deep: boolean = false): ResolvedSerializedIIdentifierValueMap {
		if (this.pathValidator.isBlacklisted(fileName)) return {___kind: IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP, map: {}};

		const cached = this.cache.getCachedResolvedSerializedIdentifierValueMap(fileName);
		if (cached != null && !this.cache.cachedResolvedSerializedIdentifierValueMapNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getResolvedSerializedIdentifierValuesForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);

		const declarations = this.getResolvedSerializedIdentifierValues(statements, deep);
		this.cache.setCachedResolvedSerializedIdentifierValueMap(fileName, declarations);
		return <any>declarations;
	}

	/**
	 * Gets a map of all identifiers for the given statements and their resolved serialized values.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedSerializedIIdentifierValueMap}
	 */
	public getResolvedSerializedIdentifierValues (statements: (Statement|Expression|Node)[], deep: boolean = false): ResolvedSerializedIIdentifierValueMap {

		const map: ResolvedSerializedIIdentifierValueMapIndexer = {};
		const unserialized = this.getResolvedIdentifierValues(statements, deep);

		Object.keys(unserialized.map).forEach(key => {
			const value = unserialized.map[key];
			const type = this.marshaller.getTypeOf(value);

			switch (type) {
				case "object":
					map[key] = <string>this.marshaller.marshal(<object>value, "");
					break;

				case "constructor":
					const ctor = <{ [key: string]: ArbitraryValue }&Function>value;
					const staticKeys = Object.getOwnPropertyNames(ctor);

					const mappedKeys: { [key: string]: string } = {};
					staticKeys.forEach(staticKey => {
						if (staticKey === "length" || staticKey === "prototype") return;

						const value = ctor[staticKey];
						mappedKeys[staticKey] = <string>this.marshaller.marshal(<object>value, "");
					});
					map[key] = mappedKeys;
					break;

				case "class":
					const ctorForClass = <{ [key: string]: ArbitraryValue }&Function>value;
					const staticKeysForClass = Object.getOwnPropertyNames(ctorForClass.constructor);

					const mappedKeysForClass: { [key: string]: string } = {};
					staticKeysForClass.forEach(staticKey => {
						const value = ctorForClass[staticKey];
						mappedKeysForClass[staticKey] = <string>this.marshaller.marshal(<object>value, "");
					});
					map[key] = mappedKeysForClass;
					break;
				default:
					map[key] = <string>this.marshaller.marshal(<object>value, "");
			}
		});

		const resolvedMap: ResolvedSerializedIIdentifierValueMap = {
			___kind: IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP,
			map
		};

		Object.defineProperty(resolvedMap, "___kind", {
			value: IdentifierMapKind.RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP,
			enumerable: false
		});
		return resolvedMap;
	}

	/**
	 * Gets a map of all identifiers for the given file and their resolved values.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedIIdentifierValueMap}
	 */
	public getResolvedIdentifierValuesForFile (fileName: string, deep: boolean = false): ResolvedIIdentifierValueMap {
		if (this.pathValidator.isBlacklisted(fileName)) return {___kind: IdentifierMapKind.RESOLVED_IDENTIFIER_VALUE_MAP, map: {}};

		const cached = this.cache.getCachedResolvedIdentifierValueMap(fileName);
		if (cached != null && !this.cache.cachedResolvedIdentifierValueMapNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getResolvedIdentifierValuesForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);

		const declarations = this.getResolvedIdentifierValues(statements, deep);
		this.cache.setCachedResolvedIdentifierValueMap(fileName, <any>declarations);
		return <any>declarations;
	}

	/**
	 * Gets a map of all identifiers for the given statements and their resolved values.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {ResolvedIIdentifierValueMap}
	 */
	public getResolvedIdentifierValues (statements: (Statement|Expression|Node)[], deep: boolean = false): ResolvedIIdentifierValueMap {

		const map: ResolvedIIdentifierValueMapIndexer = {};

		const enums = this.getEnumDeclarations(statements, deep);
		const variables = this.getVariableAssignments(statements, deep);
		const classes = this.getClassDeclarations(statements, deep);
		const functions = this.getFunctionDeclarations(statements, deep);
		const imports = this.getImportDeclarations(statements, deep);
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
		const resolvedMap: ResolvedIIdentifierValueMap = {
			___kind: IdentifierMapKind.RESOLVED_IDENTIFIER_VALUE_MAP,
			map
		};

		Object.defineProperty(resolvedMap, "___kind", {
			value: IdentifierMapKind.RESOLVED_IDENTIFIER_VALUE_MAP,
			enumerable: false
		});
		return resolvedMap;
	}

	/**
	 * Gets all function declarations (if any) that occurs in the given file
	 * and returns them in a FunctionIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {FunctionIndexer}
	 */
	public getFunctionDeclarationsForFile (fileName: string, deep: boolean = false): FunctionIndexer {
		if (this.pathValidator.isBlacklisted(fileName)) return {};

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
	public getFunctionDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): FunctionIndexer {
		const functionIndexer: FunctionIndexer = {};

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (!this.isResolvingStatement(statement)) {
				if (isFunctionDeclaration(statement)) {
					this.setResolvingStatement(statement);
					const formatted = this.functionFormatter.format(statement);
					Object.assign(functionIndexer, {[formatted.name]: formatted});
					this.removeResolvingStatement(statement);
				}
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
		if (this.pathValidator.isBlacklisted(fileName)) return {};

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
	public getEnumDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): EnumIndexer {
		const enumIndexer: EnumIndexer = {};

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (!this.isResolvingStatement(statement)) {
				if (isEnumDeclaration(statement)) {
					this.setResolvingStatement(statement);
					const formatted = this.enumFormatter.format(statement);
					Object.assign(enumIndexer, {[formatted.name]: formatted});
					this.removeResolvingStatement(statement);
				}
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
		if (this.pathValidator.isBlacklisted(fileName)) return {___kind: IdentifierMapKind.IDENTIFIER_MAP, enums: {}, classes: {}, variables: {}, functions: {}, callExpressions: [], imports: [], exports: [], mutations: [], arrowFunctions: []};

		const cached = this.cache.getCachedIdentifierMap(fileName);
		if (cached != null && !this.cache.cachedIdentifierMapNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getAllIdentifiersForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const map = this.getAllIdentifiers(statements, deep);
		this.cache.setCachedIdentifierMap(fileName, map);
		return map;
	}

	/**
	 * Gets all identifiers (such as variables, functions, classes, enums, imports, exports, etc) (if any) that occurs in the given array of statements
	 * and returns them in a IIdentifierMap. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IIdentifierMap}
	 */
	public getAllIdentifiers (statements: (Statement|Expression|Node)[], deep: boolean = false): IIdentifierMap {

		const map: IIdentifierMap = {
			___kind: IdentifierMapKind.IDENTIFIER_MAP,
			enums: this.getEnumDeclarations(statements, deep),
			variables: this.getVariableAssignments(statements, deep),
			classes: this.getClassDeclarations(statements, deep),
			functions: this.getFunctionDeclarations(statements, deep),
			imports: this.getImportDeclarations(statements, deep),
			exports: this.getExportDeclarations(statements),
			callExpressions: this.getCallExpressions(statements, deep),
			mutations: this.getMutations(statements, deep),
			arrowFunctions: this.getArrowFunctions(statements, deep)
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
		if (this.pathValidator.isBlacklisted(fileName)) return {};

		const cached = this.cache.getCachedVariableIndexer(fileName);
		if (cached != null && !this.cache.cachedVariableIndexerNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getVariableAssignmentsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const assignments = this.getVariableAssignments(statements, deep);
		this.cache.setCachedVariableIndexer(fileName, assignments);
		return assignments;
	}

	/**
	 * Gets all variable assignments (if any) that occurs in the given array of statements
	 * and returns them in a VariableIndexer. If 'deep' is true, it will walk through the Statements recursively.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {VariableIndexer}
	 */
	public getVariableAssignments (statements: (Statement|Expression|Node)[], deep: boolean = false): VariableIndexer {
		const assignmentMap: VariableIndexer = {};

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (!this.isResolvingStatement(statement)) {
				if (isVariableStatement(statement) || isVariableDeclarationList(statement) || isVariableDeclaration(statement)) {
					this.setResolvingStatement(statement);
					Object.assign(assignmentMap, this.variableFormatter.format(statement));
					this.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherAssignments = this.getVariableAssignments(this.findChildStatements(statement), deep);
				Object.keys(otherAssignments).forEach(key => {
					// Only assign the deep variable to the assignmentMap if there isn't a match in the scope above it.
					if (assignmentMap[key] == null) Object.assign(assignmentMap, {[key]: otherAssignments[key]});
				});
			}
		}
		// Make the ___kind non-enumerable.
		Object.defineProperty(assignmentMap, "___kind", {
			value: IdentifierMapKind.VARIABLE_INDEXER,
			enumerable: false
		});
		return assignmentMap;
	}

	/**
	 * Gets all class declarations (if any) that occurs in the given file
	 * and returns them as a ClassIndexer.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {ClassIndexer}
	 */
	public getClassDeclarationsForFile (fileName: string, deep: boolean = false): ClassIndexer {
		if (this.pathValidator.isBlacklisted(fileName)) return {};

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
	public getClassDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): ClassIndexer {
		const declarations: ClassIndexer = {};
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (!this.isResolvingStatement(statement)) {
				if (isClassDeclaration(statement)) {
					this.setResolvingStatement(statement);
					const declaration = this.getClassDeclaration(statement);
					declarations[declaration.name] = declaration;
					this.removeResolvingStatement(statement);
				}
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
	 * Gets and returns all ArrowFunctions (if any) that occur in the given file
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IArrowFunction[]}
	 */
	public getArrowFunctionsForFile (fileName: string, deep: boolean = false): IArrowFunction[] {
		if (this.pathValidator.isBlacklisted(fileName)) return [];

		const cached = this.cache.getCachedArrowFunctions(fileName);
		if (cached != null && !this.cache.cachedArrowFunctionsNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getArrowFunctionsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const functions = this.getArrowFunctions(statements, deep);

		this.cache.setCachedArrowFunctions(fileName, functions);
		return functions;
	}

	/**
	 * Gets and returns all ArrowFunctions (if any) that occur in the given array of statements.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IArrowFunction[]}
	 */
	public getArrowFunctions (statements: (Statement|Expression|Node)[], deep: boolean = false): IArrowFunction[] {
		const declarations: IArrowFunction[] = [];
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (
				isArrowFunction(statement)
			) {
				if (!this.isResolvingStatement(statement)) {
					this.setResolvingStatement(statement);
					const declaration = this.getArrowFunction(statement);
					if (declaration != null) declarations.push(declaration);
					this.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherArrowFunctions = this.getArrowFunctions(this.findChildStatements(statement), deep);
				otherArrowFunctions.forEach(declaration => declarations.push(declaration));
			}
		}

		Object.defineProperty(declarations, "___kind", {
			value: IdentifierMapKind.ARROW_FUNCTIONS,
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
		if (this.pathValidator.isBlacklisted(fileName)) return [];

		const cached = this.cache.getCachedImportDeclarations(fileName);
		if (cached != null && !this.cache.cachedImportDeclarationsNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getImportDeclarationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const declarations = this.getImportDeclarations(statements, deep);

		this.cache.setCachedImportDeclarations(fileName, declarations);
		return declarations;
	}
	/**
	 * Gets and returns all ImportDeclarations (if any) that occur in the given array of statements.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IImportDeclaration[]}
	 */
	public getImportDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): IImportDeclaration[] {
		const declarations: IImportDeclaration[] = [];
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (
				isImportDeclaration(statement) ||
				isImportEqualsDeclaration(statement) ||
				isVariableStatement(statement) ||
				isCallExpression(statement)
			) {
				if (!this.isResolvingStatement(statement)) {
					this.setResolvingStatement(statement);
					const declaration = this.getImportDeclaration(statement);
					if (declaration != null) declarations.push(declaration);
					this.removeResolvingStatement(statement);
				}
			}

			if (isExpressionStatement(statement) && isCallExpression(statement.expression)) {
				if (!this.isResolvingStatement(statement.expression)) {
					this.setResolvingStatement(statement.expression);
					const declaration = this.getImportDeclaration(statement.expression);
					if (declaration != null) declarations.push(declaration);
					this.removeResolvingStatement(statement.expression);
				}
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
	 * Tracks all BinaryExpressions in the given file, checks if they assign new values to identifiers and returns an array of IMutationDeclarations.
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IMutationDeclaration[]}
	 */
	public getMutationsForFile (fileName: string, deep: boolean = false): IMutationDeclaration[] {
		if (this.pathValidator.isBlacklisted(fileName)) return [];

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getMutationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		return this.getMutations(statements, deep);
	}
	/**
	 * Tracks all BinaryExpressions in the given array of statements, checks if they assign new values to identifiers and returns an array of IMutationDeclarations.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getMutations (statements: (Statement|Expression|Node)[], deep: boolean = false): IMutationDeclaration[] {
		const mutations: IMutationDeclaration[] = [];
		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (!this.isResolvingStatement(statement)) {
				if (
					isBinaryExpression(statement) ||
					isExpressionStatement(statement)
				) {
					this.setResolvingStatement(statement);
					const mutation = this.getMutation(statement);
					if (mutation != null) mutations.push(mutation);
					this.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherMutations = this.getMutations(this.findChildStatements(statement), deep);
				otherMutations.forEach(mutation => mutations.push(mutation));
			}
		}
		return mutations;
	}
	/**
	 * Gets all ExportDeclarations (if any) that occur in the given file and returns an array of IExportDeclarations
	 * @param {string} fileName
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getExportDeclarationsForFile (fileName: string, deep: boolean = false): IExportDeclaration[] {
		if (this.pathValidator.isBlacklisted(fileName)) return [];

		const cached = this.cache.getCachedExportDeclarations(fileName);
		if (cached != null && !this.cache.cachedExportDeclarationsNeedsUpdate(fileName)) return cached.content;

		const statements = this.getFile(fileName);
		if (statements == null) throw new ReferenceError(`${this.getExportDeclarationsForFile.name} could not find any statements associated with the given filename: ${fileName}. Have you added it to the service yet?`);
		const declarations = this.getExportDeclarations(statements, deep);
		this.cache.setCachedExportDeclarations(fileName, declarations);
		return declarations;
	}
	/**
	 * Gets all ExportDeclarations (if any) that occur in the given array of statements and returns an array
	 * of IExportDeclarations.
	 * @param {(Statement|Expression|Node)[]} statements
	 * @param {boolean} [deep=false]
	 * @returns {IExportDeclaration[]}
	 */
	public getExportDeclarations (statements: (Statement|Expression|Node)[], deep: boolean = false): IExportDeclaration[] {
		const declarations: IExportDeclaration[] = [];

		for (const statement of statements) {
			// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
			if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) continue;

			if (!this.isResolvingStatement(statement)) {
				if (
					isExportDeclaration(statement) ||
					isExportAssignment(statement) ||
					isVariableStatement(statement) ||
					isFunctionDeclaration(statement) ||
					isClassDeclaration(statement) ||
					isExpressionStatement(statement) ||
					isBinaryExpression(statement) ||
					isCallExpression(statement)
				) {
					this.setResolvingStatement(statement);
					const declaration = this.getExportDeclaration(statement);
					if (declaration != null) declarations.push(declaration);
					this.removeResolvingStatement(statement);
				}
			}

			if (deep) {
				const otherExportDeclarations = this.getExportDeclarations(this.findChildStatements(statement), deep);
				otherExportDeclarations.forEach(declaration => declarations.push(declaration));
			}
		}
		return declarations;
	}
	/**
	 * If given an ArrowFunction, a formatted IArrowFunction will be returned.
	 * @param {ArrowFunction} statement
	 * @returns {IArrowFunction}
	 */
	private getArrowFunction (statement: ArrowFunction): IArrowFunction {
		return this.arrowFunctionFormatter.format(statement);
	}
	/**
	 * If given something that might be a mutation (such as element.foo = "bar"), a formatted IMutationDeclaration will be returned.
	 * @param {BinaryExpression} statement
	 * @returns {IMutationDeclaration|null}
	 */
	private getMutation (statement: BinaryExpression|ExpressionStatement): IMutationDeclaration|null {
		return this.mutationFormatter.format(statement);
	}
	/**
	 * Formats the given Statement into an ICallExpression.
	 * @param {Statement|Expression} statement
	 * @returns {ICallExpression}
	 */
	private getCallExpression (statement: Statement|Expression): ICallExpression {
		if (isCallExpression(statement)) {
			return this.callExpressionFormatter.format(statement);
		}

		throw new TypeError(`${this.getCallExpression.name} could not format a CallExpression of kind ${SyntaxKind[statement.kind]}`);
	}

	/**
	 *Formats the given Statement into an INewExpression.
	 * @param {Statement|Expression} statement
	 * @returns {INewExpression}
	 */
	private getNewExpression (statement: Statement|Expression): INewExpression {
		if (isNewExpression(statement)) {
			return this.newExpressionFormatter.format(statement);
		}
		throw new TypeError(`${this.getNewExpression.name} could not format a NewExpression of kind ${SyntaxKind[statement.kind]}`);
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

	private isResolvingStatement (statement: Statement|Expression|Node): boolean {
		return CodeAnalyzer.RESOLVING_STATEMENTS.has(statement);
	}

	private setResolvingStatement (statement: Statement|Expression|Node): void {
		CodeAnalyzer.RESOLVING_STATEMENTS.add(statement);
	}

	private removeResolvingStatement (statement: Statement|Expression|Node): void {
		CodeAnalyzer.RESOLVING_STATEMENTS.delete(statement);
	}

	/**
	 * Finds all "children" of the given statement, if it has any.
	 * @param {Statement|Expression} statement
	 * @returns {(Statement|Declaration|Expression|Node)[]}
	 */
	private findChildStatements (statement: Statement|Expression|Declaration|Node): (Statement|Declaration|Expression|Node)[] {
		// Skip the kind (and don't traverse its parents) if the statement kind is blacklisted.
		if (CodeAnalyzer.SKIP_KINDS.has(statement.kind)) return [];

		if (isIfStatement(statement)) {

			const thenChildren = statement.thenStatement == null ? [] : [statement.thenStatement];
			const elseChildren = statement.elseStatement == null ? [] : [statement.elseStatement];
			return [statement.expression, ...thenChildren, ...elseChildren];
		}

		if (isShorthandPropertyAssignment(statement)) {
			return statement.objectAssignmentInitializer == null ? [] : [statement.objectAssignmentInitializer];
		}

		if (isDefaultClause(statement) || isCaseClause(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = isCaseClause(statement) ? [statement.expression] : [];
			statement.statements.forEach(child => statements.push(child));
			return statements;
		}

		if (isWhileStatement(statement)) {
			return [statement.expression, statement.statement];
		}

		if (isExportAssignment(statement)) {
			return [statement.expression];
		}

		if (isExportDeclaration(statement)) {
			return statement.moduleSpecifier == null ? [] : [statement.moduleSpecifier];
		}

		if (isParenthesizedExpression(statement)) {
			return [statement.expression];
		}

		if (isCaseBlock(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.clauses.forEach(clause => statements.push(clause));

			return statements;
		}

		if (isAwaitExpression(statement)) {
			return [statement.expression];
		}

		if (isSwitchStatement(statement)) {
			return [statement.expression, statement.caseBlock];
		}

		if (isBlockDeclaration(statement)) {
			return statement.statements;
		}

		if (isReturnStatement(statement)) {
			return statement.expression == null ? [] : [statement.expression];
		}

		if (isArrowFunction(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isLabeledStatement(statement)) {
			return [statement.statement];
		}

		if (isConditionalExpression(statement)) {
			const whenTrue = statement.whenTrue == null ? [] : [statement.whenTrue];
			const whenFalse = statement.whenFalse == null ? [] : [statement.whenFalse];
			return [statement.condition, ...whenTrue, ...whenFalse];
		}

		if (isBinaryExpression(statement)) {
			return [statement.left, statement.right];
		}

		if (isFunctionDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isExpressionStatement(statement)) {
			return [statement.expression];
		}

		if (isTryStatement(statement)) {

			const catchClause = statement.catchClause == null ? [] : [statement.catchClause.block];
			const finallyBlock = statement.finallyBlock == null ? [] : [statement.finallyBlock];

			return [statement.tryBlock, ...catchClause, ...finallyBlock];
		}

		if (isSpreadAssignment(statement) || isSpreadElement(statement)) {
			return [statement.expression];
		}

		if (isVariableStatement(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];

			statement.declarationList.declarations.forEach(declaration => statements.push(declaration));
			return statements;
		}

		if (isVariableDeclarationList(statement)) {
			const list: Declaration[] = [];
			statement.declarations.forEach(declaration => list.push(declaration));
			return list;
		}

		if (isVariableDeclaration(statement)) {
			return statement.initializer == null ? [] : [statement.initializer];
		}

		if (isElementAccessExpression(statement)) {
			return [statement.expression];
		}

		if (isPropertyAccessExpression(statement)) {
			return [statement.expression];
		}

		if (isPrefixUnaryExpression(statement)) {
			return [statement.operand];
		}

		if (isPostfixUnaryExpression(statement)) {
			return [statement.operand];
		}

		if (isFunctionExpression(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isTypeOfExpression(statement)) {
			return [statement.expression];
		}

		if (isMethodDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isTemplateExpression(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			if (statement.templateSpans == null) return [];
			statement.templateSpans.forEach(span => statements.push(span.expression));

			return statements;
		}

		if (isObjectLiteralExpression(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.properties.forEach(property => statements.push(property));

			return statements;
		}

		if (isPropertyAssignment(statement)) {
			return [statement.initializer];
		}

		if (isConstructorDeclaration(statement)) {
			return [...statement.parameters, ...(statement.body == null ? [] : [statement.body])];
		}

		if (isArrayLiteralExpression(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.elements.forEach(element => statements.push(element));

			return statements;
		}

		if (isPropertyDeclaration(statement)) {
			return statement.initializer == null ? [] : [statement.initializer];
		}

		if (isClassExpression(statement) || isClassDeclaration(statement)) {
			const statements: (Statement|Declaration|Expression|Node)[] = [];
			statement.members.forEach(member => statements.push(member));

			return statements;
		}

		if (isForStatement(statement)) {
			const condition = statement.condition == null ? [] : [statement.condition];
			const incrementor = statement.incrementor == null ? [] : [statement.incrementor];
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			const body = statement.statement == null ? [] : [statement.statement];
			return [...condition, ...incrementor, ...initializer, ...body];
		}

		if (isForInStatement(statement)) {
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			const expression = statement.expression == null ? [] : [statement.expression];
			const body = statement.statement == null ? [] : [statement.statement];
			return [...expression, ...initializer, ...body];
		}

		if (isForOfStatement(statement)) {
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			const expression = statement.expression == null ? [] : [statement.expression];
			const body = statement.statement == null ? [] : [statement.statement];
			return [...expression, ...initializer, ...body];
		}

		if (isParameterDeclaration(statement)) {
			const initializer = statement.initializer == null ? [] : [statement.initializer];
			return [...initializer];
		}

		if (isTypeAssertionExpression(statement)) {
			return [statement.expression];
		}

		if (isDoStatement(statement)) {
			return [statement.expression];
		}

		if (isCallExpression(statement)) {
			return statement.arguments;
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
	 * If given an ImportDeclaration|ImportEqualsDeclaration, a formatted IImportDeclaration will be returned holding the relative and full import-path
	 * as well as any bindings that will live in the local scope of the given file.
	 * @param {ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression} statement
	 * @returns {IImportDeclaration}
	 */
	private getImportDeclaration (statement: ImportDeclaration|ImportEqualsDeclaration|VariableStatement|CallExpression): IImportDeclaration|null {
		return this.importFormatter.format(statement);
	}

	/**
	 * If given something that might be an export declaration, a formatted IExportDeclaration will be returned holding the relative and full export-path
	 * as well as any bindings that will live in the local scope of the given file.
	 * @param {ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|BinaryExpression|CallExpression} statement
	 * @returns {IExportDeclaration}
	 */
	private getExportDeclaration (statement: ExportDeclaration|VariableStatement|ExportAssignment|FunctionDeclaration|ClassDeclaration|ExpressionStatement|BinaryExpression|CallExpression): IExportDeclaration|null {
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