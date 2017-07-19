import {ArrayLiteralExpression, BooleanLiteral, NoSubstitutionTemplateLiteral, NumericLiteral, ObjectLiteralExpression, RegularExpressionLiteral, StringLiteral} from "typescript";

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
	VARIABLE = 1000, MUTATION = 1001, IMPORT = 1002, EXPORT = 1003, IMPORT_EXPORT_BINDING = 1004, PROP = 1005,
	PARAMETER = 1006, ARGUMENT = 1007, METHOD = 1008, CONSTRUCTOR = 1009, FUNCTION = 1010, DECORATOR = 1011,
	CLASS = 1012, ENUM = 1013, CALL_EXPRESSION = 1014, NEW_EXPRESSION = 1015, CLASS_INDEXER = 1016, VARIABLE_INDEXER = 1017,
	NAMESPACED_MODULE_INDEXER = 1018, ENUM_INDEXER = 1019, IMPORTS = 1020, FUNCTION_INDEXER = 1021, IDENTIFIER_MAP = 1022,
	REQUIRE_CALL = 1023, LITERAL = 1024, RESOLVED_IDENTIFIER_VALUE_MAP = 1025, RESOLVED_SERIALIZED_IDENTIFIER_VALUE_MAP = 1026,
	ARROW_FUNCTION = 1027, ARROW_FUNCTIONS = 1028, GET_ACCESSOR = 1029, SET_ACCESSOR = 1030, EXPORTS = 1031, CALL_EXPRESSIONS = 1032, MUTATIONS = 1033
}

export interface IPayloadable {
	payload (): IIdentifier;
}

export interface IImportExportBinding extends IKindable, IPositionable, IPayloadable {
	name: string;
	kind: ImportExportKind;
}

export interface IModulePath {
	relativePath (): string;
	fullPath (): string;
}

export declare type ModuleSource = IBindingIdentifier|IModulePath;

export interface IKindable {
	___kind: IdentifierMapKind;
}

export declare type IExportDeclaration = IModuleDeclaration;
export declare type IImportDeclaration = IModuleDeclaration;

export interface IExportDeclarationable {
	exportDeclaration: IExportDeclaration;
}

export interface IImportDeclarationable {
	importDeclaration: IImportDeclaration;
}

export interface IModuleDeclaration extends IPositionable, IFilePathable, IKindable {
	moduleKind: ModuleDependencyKind;
	source: ModuleSource;
	bindings: IImportExportIndexer;
}

export interface IModuleDeclarationable {
	moduleDeclaration: IModuleDeclaration;
}

export interface ICallExpression extends IPositionable, IArgumentsable, ICallable, IFilePathable, IKindable {
	type: ITypeable;
}

export interface ICallExpressionable {
	callExpression: ICallExpression;
}

export interface IEnumDeclaration extends INameable, IPositionable, IDecoratorsable, IFilePathable, IKindable {
	members: { [key: string]: number|string };
}

export interface IEnumDeclarationable {
	enumDeclaration: IEnumDeclaration;
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

export interface INewExpressionable {
	newExpression: INewExpression;
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
	returnStatement: null|(IPositionable&IContentsable&{ value: IValueable });
}

export interface IFunctionLike extends IParametersable, IMemberDeclaration, IReturnStatementable, IModifiersable {
}

export interface IFunctionDeclaration extends IFunctionLike, IFilePathable, IKindable {
	name: string;
	value: IValueable;
}

export interface IFunctionDeclarationable {
	functionDeclaration: IFunctionDeclaration;
}

export interface IArrowFunction extends IFunctionLike, IFilePathable, IKindable {
	value: IValueable;
}

export interface IArrowFunctionable {
	arrowFunction: IArrowFunction;
}

export interface IClassNameable {
	className: string;
}

export interface IMethodDeclaration extends INameable, IFunctionLike, IFilePathable, IClassNameable, IKindable, IIsStaticable {
	value: IValueable;
}

export interface IMethodDeclarationable {
	methodDeclaration: IMethodDeclaration;
}

export interface IGetAccessorDeclaration extends IMethodDeclaration {
}

export interface IGetAccessorDeclarationable {
	getAccessorDeclaration: IGetAccessorDeclaration;
}

export interface ISetAccessorDeclaration extends IMethodDeclaration {
}

export interface ISetAccessorDeclarationable {
	setAccessorDeclaration: ISetAccessorDeclaration;
}

export interface IConstructorDeclaration extends INameable, IFunctionLike, IFilePathable, IClassNameable, IKindable {
	value: IValueable;
}

export interface IConstructorDeclarationable {
	constructorDeclaration: IConstructorDeclaration;
}

export interface IExtendsRelation extends ITypeBinding {
	resolve (): IClassDeclaration;
}

export interface IHeritage {
	extendsClass: IExtendsRelation|null;
	implementsInterfaces: ITypeBinding[];
}

export interface IHeritageable {
	heritage: IHeritage;
}

export interface IClassDeclaration extends IMemberDeclaration, INameable, IFilePathable, IKindable, IModifiersable {
	methods: IResolvedMethodMap;
	props: IPropIndexer;
	constructor: IConstructorDeclaration|null;
	heritage: IHeritage|null;
	value: IValueable;
	mergeWithParent (): void;
}

export interface IClassDeclarationable {
	classDeclaration: IClassDeclaration;
}

export interface IPositionable {
	startsAt: number;
	endsAt: number;
}

export declare interface IParameter extends IFilePathable, IPositionable, IKindable {
	name: (string|undefined)[];
	nameFormatted: string[];
	parameterKind: ParameterKind;
	type: ITypeable;
	value: IValueable;
}

export interface IParameterable {
	parameter: IParameter;
}

export interface IRequire extends IPositionable, IKindable, IModulePath, IFilePathable, IPayloadable, IArgumentsable {
}

export declare interface IArgument extends IPositionable, IKindable {
	value: IValueable;
}

export interface IArgumentable {
	argument: IArgument;
}

export interface IArbitraryObject<T> {
	[key: string]: T;
	[key: number]: T;
}

export interface IDecorator extends IPositionable, IKindable {
	name: string;
}

export interface IDecoratorable {
	decorator: IDecorator;
}

export interface IDecoratorsable {
	decorators: IDecoratorIndexer;
}

export interface IIsStaticable {
	isStatic: boolean;
}

export declare interface IPropDeclaration extends IDecoratorsable, IPositionable, INameable, IFilePathable, IClassNameable, IKindable, IIsStaticable, IModifiersable {
	type: ITypeable;
	value: IValueable;
}

export interface IPropDeclarationable {
	propDeclaration: IPropDeclaration;
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
	resolved: ArbitraryValue;
	resolvedPrecompute: ArbitraryValue;
	resolve (insideThisScope?: boolean): ArbitraryValue;
	hasDoneFirstResolve (): boolean;
}

export interface INonNullableValueable {
	resolving: boolean;
	resolved: ArbitraryValue;
	resolvedPrecompute: ArbitraryValue;
	expression: InitializationValue;
	resolve (): ArbitraryValue;
}

export interface IVersionable {
	version: number;
}

export interface ICachedContent<T> extends IVersionable {
	content: T;
}

export interface IBaseVariableDeclaration extends IPositionable, IFilePathable, IKindable, IModifiersable {
	type: ITypeable;
}

export interface IModifiersable {
	modifiers: Set<string>;
}

export interface IMutationDeclaration extends IPositionable, IFilePathable, IKindable, IIdentifierable, IPropertyable {
	value: IValueable;
}

export interface IMutationDeclarationable {
	mutationDeclaration: IMutationDeclaration;
}

export interface IVariableDeclaration extends IPositionable, INameable, IFilePathable, IKindable, IModifiersable {
	value: IValueable;
	type: ITypeable;
}

export interface IVariableDeclarationable {
	variableDeclaration: IVariableDeclaration;
}

export interface IFilePathable {
	filePath: string;
}

export interface IFileContentsable {
	fileContents: string;
}

export interface ISourceFileProperties extends IFilePathable, IFileContentsable {
}

export interface IIdentifierMap extends IKindable {
	enums: IEnumIndexer;
	classes: IClassIndexer;
	variables: IVariableIndexer;
	functions: IFunctionIndexer;
	callExpressions: ICallExpression[];
	imports: IImportDeclaration[];
	exports: IExportDeclaration[];
	mutations: IMutationDeclaration[];
	arrowFunctions: IArrowFunction[];
}

export interface IResolvedIIdentifierValueMap extends IKindable {
	map: IResolvedIIdentifierValueMapIndexer;
}

export interface IResolvedSerializedIIdentifierValueMap extends IKindable {
	map: IResolvedSerializedIIdentifierValueMapIndexer;
}

export interface ILiteralValue extends IKindable, IPositionable {
	value (): ArbitraryValue[];
}

export interface INamespacedModuleMap extends IKindable, IPositionable {
	[key: string]: IIdentifier|IdentifierMapKind;
}

export interface IEnumIndexer {
	[key: string]: IEnumDeclaration;
}

export interface IResolvedIIdentifierValueMapIndexer {
	[key: string]: IResolvedIIdentifierValueMapIndexer|ArbitraryValue;
}

export interface IResolvedSerializedIIdentifierValueMapIndexer {
	[key: string]: IResolvedSerializedIIdentifierValueMapIndexer|string;
}

export interface IFunctionIndexer {
	[key: string]: IFunctionDeclaration;
}

export interface IResolvedMethodMap {
	[key: string]: IMethodDeclaration;
}

export interface IImportExportIndexer {
	[key: string]: IImportExportBinding;
}

export interface IClassIndexer {
	[key: string]: IClassDeclaration;
}

export interface IVariableIndexer {
	[key: string]: IVariableDeclaration;
}

export interface IDecoratorIndexer {
	[key: string]: IDecorator;
}

export interface IPropIndexer {
	[key: string]: IPropDeclaration;
}

export declare type LiteralExpression = ArrayLiteralExpression|StringLiteral|NumericLiteral|BooleanLiteral|ObjectLiteralExpression|NoSubstitutionTemplateLiteral|RegularExpressionLiteral;
export declare type IIdentifier = IGetAccessorDeclaration|ISetAccessorDeclaration|IArrowFunction|INamespacedModuleMap|ILiteralValue|IMutationDeclaration|IImportExportBinding|IConstructorDeclaration|IArgument|IDecorator|IImportDeclaration|ICallExpression|INewExpression|IParameter|IVariableDeclaration|IClassDeclaration|IEnumDeclaration|IFunctionDeclaration|IRequire;
export declare type IExportableIIdentifier = IArrowFunction|ILiteralValue|IVariableDeclaration|IClassDeclaration|IEnumDeclaration|IFunctionDeclaration;
export declare type NonNullableArbitraryValue = string|boolean|symbol|number|Function|object|IBindingIdentifier|ITypeBinding|{};
export declare type ArbitraryValue = NonNullableArbitraryValue|null|undefined;
export declare type ArbitraryValueIndexable = ArbitraryValue|IArbitraryObject<ArbitraryValue>;
export declare type ArbitraryValueArray = ArbitraryValueIndexable[];
export declare type InitializationValue = ArbitraryValueArray;