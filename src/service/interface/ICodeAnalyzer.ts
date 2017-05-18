import * as ts from "typescript";
import {ArrayLiteralExpression, BooleanLiteral, Expression, LanguageServiceHost, Node, NodeArray, NoSubstitutionTemplateLiteral, NumericLiteral, ObjectLiteralExpression, RegularExpressionLiteral, Statement, StringLiteral, SyntaxKind} from "typescript";

import {IBindingIdentifier} from "../../model/interface/IBindingIdentifier";

export enum ImportExportKind {
	NAMESPACE, DEFAULT, NAMED
}

export const NAMESPACE_NAME = "____NAMESPACE____";

export enum ParameterKind {
	OBJECT_BINDING, ARRAY_BINDING, STANDARD
}

export enum ModuleDependencyKind {
	ES_MODULE, REQUIRE, IMPORT_REQUIRE
}

export enum IdentifierMapKind {
	VARIABLE = 1000, MUTATION = 1001, IMPORT = 1002, EXPORT = 1003, IMPORT_EXPORT_BINDING = 1004, PROP = 1005, PARAMETER = 1006, ARGUMENT = 1007, METHOD = 1008, CONSTRUCTOR = 1009, FUNCTION = 1010, DECORATOR = 1011, CLASS = 1012, ENUM = 1013, CALL_EXPRESSION = 1014, NEW_EXPRESSION = 1015, CLASS_INDEXER = 1016, VARIABLE_INDEXER = 1017, NAMESPACED_MODULE_INDEXER = 1018, ENUM_INDEXER = 1019, MODULE_DEPENDENCIES = 1020, FUNCTION_INDEXER = 1021, IDENTIFIER_MAP = 1022, REQUIRE_CALL = 1023
}

export interface IPayloadable {
	payload: () => ImportExportBindingPayload;
}

export interface IImportExportBinding extends IKindable, IPositionable, IPayloadable {
	name: string;
	kind: ImportExportKind;
}

export interface IModulePath {
	relativePath: () => string;
	fullPath: () => string;
}

export declare type ModuleSource = IBindingIdentifier|IModulePath;

export interface IKindable {
	___kind: IdentifierMapKind;
}

export declare type IExportDeclaration = IModuleDeclaration;
export declare type IImportDeclaration = IModuleDeclaration;

export interface IModuleDeclaration extends IPositionable, IFilePathable, IKindable {
	moduleKind: ModuleDependencyKind;
	source: ModuleSource;
	bindings: ImportExportIndexer;
}

export interface ICallExpression extends IPositionable, IArgumentsable, ICallable, IFilePathable, IKindable {
	type: ITypeable;
}

export interface IEnumDeclaration extends INameable, IPositionable, IDecoratorsable, IFilePathable, IKindable {
	members: { [key: string]: number|string };
}

export interface IIdentifierable {
	identifier: ArbitraryValue;
}

export interface IPropertyable {
	property: ArbitraryValue;
}

export interface ICallable extends IIdentifierable, IPropertyable {
}

export interface INewExpression extends IPositionable, IArgumentsable, ICallable, IFilePathable, IKindable {
	type: ITypeable;
}

export interface IBody extends IContentsable, IPositionable {
}

export interface IBodyable {
	body: IBody;
}

export interface IContentsable {
	contents: string|null;
}

export interface IMemberDeclaration extends IPositionable, IBodyable, IDecoratorsable {
	contents: string;
}

export interface IParametersable {
	parameters: IParametersBody;
}

export interface IArgumentsable {
	arguments: IArgumentsBody;
}

export interface IParametersBody extends IPositionable {
	parametersList: IParameter[];
}

export interface IArgumentsBody extends IPositionable {
	argumentsList: IArgument[];
}

export interface IReturnStatementable {
	returnStatement: IPositionable&IContentsable;
}

export interface IFunctionLike extends IParametersable, IMemberDeclaration, IReturnStatementable, IModifiersable {
}

export interface IFunctionDeclaration extends IFunctionLike, IFilePathable, IKindable {
	name: string;
	value: IValueable;
}

export interface IClassNameable {
	className: string;
}

export interface IMethodDeclaration extends INameable, IFunctionLike, IFilePathable, IClassNameable, IKindable, isStaticable {
	value: IValueable;
}

export interface IConstructorDeclaration extends INameable, IFunctionLike, IFilePathable, IClassNameable, IKindable {
	value: IValueable;
}

export interface IHeritage {
	extendsClass: ITypeBinding|null;
	implementsInterfaces: ITypeBinding[];
}

export interface IClassDeclaration extends IMemberDeclaration, INameable, IFilePathable, IKindable, IModifiersable {
	methods: ResolvedMethodMap;
	props: PropIndexer;
	constructor: IConstructorDeclaration|null;
	heritage: IHeritage|null;
}

export interface IPositionable {
	startsAt: number;
	endsAt: number;
}

export declare interface IParameter extends IPositionable, IKindable {
	name: (string|undefined)[];
	parameterKind: ParameterKind;
	type: ITypeable;
	value: IValueable;
}

export interface IRequire extends IPositionable, IKindable, IModulePath, IFilePathable, IPayloadable, IArgumentsable {
}

export declare interface IArgument extends IPositionable, IKindable {
	value: IValueable;
}

export interface IArbitraryObject<T> {
	[key: string]: T;

	[key: number]: T;
}

export interface IDecorator extends IPositionable, IKindable {
	name: string;
}

export interface IDecoratorsable {
	decorators: DecoratorIndexer;
}

export interface isStaticable {
	isStatic: boolean;
}

export declare interface IPropDeclaration extends IDecoratorsable, IPositionable, INameable, IFilePathable, IClassNameable, IKindable, isStaticable, IModifiersable {
	type: ITypeable;
	value: IValueable;
}

export interface INameable {
	name: string;
}

export interface ITypeBinding extends INameable {
	typeArguments: TypeExpression|null;
}

export declare type TypeExpression = InitializationValue;

export interface ITypeable {
	expression: TypeExpression|null;
	flattened: string|null;
	bindings: ITypeBinding[]|null;
}

export interface IUnresolvableValueable {
	expression: InitializationValue|null;
}

export interface IValueable extends IUnresolvableValueable {
	resolving: boolean;
	resolve: (insideThisScope?: boolean) => ArbitraryValue;
	resolved: ArbitraryValue;
	resolvedPrecompute: ArbitraryValue;
	hasDoneFirstResolve: () => boolean;
}

export interface INonNullableValueable {
	resolving: boolean;
	resolve: () => ArbitraryValue;
	resolved: ArbitraryValue;
	resolvedPrecompute: ArbitraryValue;
	expression: InitializationValue;
}

export interface IVersionable {
	version: number;
}

export interface ICachedContent<T> extends IVersionable {
	content: T;
}

export interface IBaseVariableAssignment extends IPositionable, IFilePathable, IKindable, IModifiersable {
	type: ITypeable;
}

export interface IModifiersable {
	modifiers: Set<string>;
}

export interface IMutationDeclaration extends IPositionable, IFilePathable, IKindable, IIdentifierable, IPropertyable {
	value: IValueable;
}

export interface IVariableAssignment extends IPositionable, INameable, IFilePathable, IKindable, IModifiersable {
	value: IValueable;
	type: ITypeable;
}

export interface IFilePathable {
	filePath: string;
}

export interface IFileContentsable {
	fileContents: string;
}

export interface ISourceFileProperties extends IFilePathable, IFileContentsable {
}

export declare interface IIdentifierMap extends IKindable {
	enums: EnumIndexer;
	classes: ClassIndexer;
	variables: VariableIndexer;
	functions: FunctionIndexer;
	callExpressions: ICallExpression[];
	imports: IImportDeclaration[];
	exports: IExportDeclaration[];
	mutations: IMutationDeclaration[];
}

export declare type ImportExportBindingPayload = IExportableIIdentifier|NamespacedModuleMap|ArbitraryValue;
export declare type LiteralExpression = ArrayLiteralExpression|StringLiteral|NumericLiteral|BooleanLiteral|ObjectLiteralExpression|NoSubstitutionTemplateLiteral|RegularExpressionLiteral;
export declare type IIdentifier = IMutationDeclaration|IImportExportBinding|IConstructorDeclaration|IArgument|IDecorator|IImportDeclaration|ICallExpression|INewExpression|IParameter|IVariableAssignment|IClassDeclaration|IEnumDeclaration|IFunctionDeclaration;
export declare type IExportableIIdentifier = IVariableAssignment|IClassDeclaration|IEnumDeclaration|IFunctionDeclaration;
export declare type EnumIndexer = { [key: string]: IEnumDeclaration };
export declare type ResolvedNamespacedModuleMap = { [key: string]: string };
export declare type NamespacedModuleMap = { [key: string]: ImportExportBindingPayload };
export declare type FunctionIndexer = { [key: string]: IFunctionDeclaration };
export declare type ResolvedMethodMap = { [key: string]: IMethodDeclaration };
export declare type ImportExportIndexer = { [key: string]: IImportExportBinding };
export declare type ClassIndexer = { [key: string]: IClassDeclaration };
export declare type VariableIndexer = { [key: string]: IVariableAssignment };
export declare type DecoratorIndexer = { [key: string]: IDecorator };
export declare type PropIndexer = { [key: string]: IPropDeclaration };
export declare type NonNullableArbitraryValue = string|boolean|symbol|number|Function|object|IBindingIdentifier|ITypeBinding|{};
export declare type ArbitraryValue = NonNullableArbitraryValue|null|undefined;
export declare type ArbitraryValueIndexable = ArbitraryValue|IArbitraryObject<ArbitraryValue>;
export declare type ArbitraryValueArray = ArbitraryValueIndexable[];
export declare type InitializationValue = ArbitraryValueArray;

export interface ICodeAnalyzer extends LanguageServiceHost {
	typescript: typeof ts;
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	getFile(fileName: string): NodeArray<Statement>;
	removeFile (fileName: string): void;
	toAST (code: string): NodeArray<Statement>;
	getFileVersion (filePath: string): number;
	statementsIncludeKind (statements: (Statement|Expression|Node)[], kind: SyntaxKind, deep?: boolean): boolean;
	getClassDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): ClassIndexer;
	getClassDeclarationsForFile(fileName: string, deep?: boolean): ClassIndexer;
	getAllIdentifiers(statements: (Statement|Expression|Node)[], deep?: boolean): IIdentifierMap;
	getAllIdentifiersForFile(fileName: string, deep?: boolean): IIdentifierMap;
	getVariableAssignments(statements: (Statement|Expression|Node)[], deep?: boolean): VariableIndexer;
	getVariableAssignmentsForFile(fileName: string, deep?: boolean): VariableIndexer;
	getEnumDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): EnumIndexer;
	getEnumDeclarationsForFile(fileName: string, deep?: boolean): EnumIndexer;
	getFunctionDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): FunctionIndexer;
	getFunctionDeclarationsForFile(fileName: string, deep?: boolean): FunctionIndexer;
	getImportDeclarationsForFile (fileName: string, deep?: boolean): IImportDeclaration[];
	getImportDeclarations(statements: (Statement|Expression|Node)[], deep?: boolean): IImportDeclaration[];
	getExportDeclarationsForFile (fileName: string, deep?: boolean): IExportDeclaration[];
	getExportDeclarations (statements: (Statement|Expression|Node)[], deep?: boolean): IExportDeclaration[];
	getCallExpressions(statements: (Statement|Expression|Node)[], deep?: boolean): ICallExpression[];
	getCallExpressionsForFile(fileName: string, deep?: boolean): ICallExpression[];
	getNewExpressions(statements: (Statement|Expression|Node)[], deep?: boolean): INewExpression[];
	getNewExpressionsForFile(fileName: string, deep?: boolean): INewExpression[];
	getMutationsForFile (fileName: string, deep?: boolean): IMutationDeclaration[];
	getMutations (statements: (Statement|Expression|Node)[], deep?: boolean): IMutationDeclaration[];
}