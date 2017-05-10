import {Expression, LanguageServiceHost, Node, NodeArray, Statement, ArrayLiteralExpression, StringLiteral, NumericLiteral, RegularExpressionLiteral, BooleanLiteral, NoSubstitutionTemplateLiteral, ObjectLiteralExpression} from "typescript";

import {IBindingIdentifier} from "./IBindingIdentifier";

export enum ImportExportKind {
	NAMESPACE, DEFAULT, NAMED
}

export enum ModuleDependencyKind {
	ES_MODULE, REQUIRE, IMPORT_REQUIRE
}

export enum IdentifierMapKind {
	VARIABLE, IMPORT, EXPORT, PROP, PARAMETER, ARGUMENT, METHOD, CONSTRUCTOR, FUNCTION, DECORATOR, CLASS, ENUM, CALL_EXPRESSION, NEW_EXPRESSION, CLASS_INDEXER, VARIABLE_INDEXER, ENUM_INDEXER, MODULE_DEPENDENCIES, FUNCTION_INDEXER, IDENTIFIER_MAP
}

export interface IImportExportBinding {
	name: string;
	payload?: ImportExportBindingPayload;
	kind: ImportExportKind;
}

export interface IModulePath {
	relativePath: string;
	fullPath: string;
}

export declare type ModuleSource = IBindingIdentifier | IModulePath;

export interface IKindable {
	___kind: IdentifierMapKind;
}

export interface IExportDeclaration extends IPositionable, IFilePathable, IKindable {
	moduleKind: ModuleDependencyKind;
	source: ModuleSource;
	bindings: ImportExportIndexer;
}

export interface IImportDeclaration extends IPositionable, IFilePathable, IKindable {
	moduleKind: ModuleDependencyKind;
	source: ModuleSource;
	bindings: ImportExportIndexer;
}

export interface ICallExpression extends IPositionable, IArgumentsable, ICallable, IFilePathable, IKindable {
	type: ITypeable;
}

export interface IEnumDeclaration extends INameable, IPositionable, IDecoratorsable, IFilePathable, IKindable {
	members: { [key: string]: number | string };
}

export interface ICallable {
	property: ArbitraryValue;
	identifier: NonNullableArbitraryValue;
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
	contents: string | null;
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
	returnStatement: IPositionable & IContentsable;
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

export interface IConstructorDeclaration extends IMemberDeclaration, IParametersable, IFilePathable, IClassNameable, IKindable {

}

export interface IHeritage {
	extendsClass: ITypeBinding | null;
	implementsInterfaces: ITypeBinding[];
}

export interface IClassDeclaration extends IMemberDeclaration, INameable, IFilePathable, IKindable, IModifiersable {
	methods: ResolvedMethodMap;
	props: PropIndexer;
	constructor: IConstructorDeclaration | null;
	heritage: IHeritage | null;
}

export interface IPositionable {
	startsAt: number;
	endsAt: number;
}

export declare interface IParameter extends IPositionable, INameable, IKindable {
	type: ITypeable;
	value: IValueable;
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
	typeArguments: TypeExpression | null;
}

export declare type TypeExpression = InitializationValue;

export interface ITypeable {
	expression: TypeExpression | null;
	flattened: string | null;
	bindings: ITypeBinding[] | null;
}

export interface IUnresolvableValueable {
	expression: InitializationValue | null;
}

export interface IValueable extends IUnresolvableValueable {
	resolving: boolean;
	resolve: () => string | null;
	resolved: string | null | undefined;
	hasDoneFirstResolve: () => boolean;
}

export interface INonNullableValueable {
	resolving: boolean;
	resolve: () => string | null;
	resolved: string | null;
	expression: InitializationValue;
}

export interface IVersionable {
	version: number;
}

export interface ICachedContent<T> extends IVersionable {
	content: T;
}

export interface IBaseVariableAssignment extends IPositionable, IFilePathable, IKindable, IModifiersable {
	value: IUnresolvableValueable;
	type: ITypeable;
}

export interface IModifiersable {
	modifiers: Set<string>;
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
}

export declare type ImportExportBindingPayload = ArbitraryValue|IIdentifier;
export declare type LiteralExpression = ArrayLiteralExpression|StringLiteral|NumericLiteral|BooleanLiteral|ObjectLiteralExpression|NoSubstitutionTemplateLiteral|RegularExpressionLiteral;
export declare type IIdentifier = IArgument|IDecorator|IImportDeclaration|ICallExpression|INewExpression|IParameter | IVariableAssignment | IClassDeclaration | IEnumDeclaration | IFunctionDeclaration;
export declare type EnumIndexer = { [key: string]: IEnumDeclaration };
export declare type NamespacedExportMap = { [key: string]: ImportExportBindingPayload };
export declare type FunctionIndexer = { [key: string]: IFunctionDeclaration };
export declare type ResolvedMethodMap = { [key: string]: IMethodDeclaration };
export declare type ImportExportIndexer = { [key: string]: IImportExportBinding };
export declare type ClassIndexer = { [key: string]: IClassDeclaration };
export declare type VariableIndexer = { [key: string]: IVariableAssignment };
export declare type DecoratorIndexer = { [key: string]: IDecorator };
export declare type TypeArgument = string | boolean | symbol | number | null | undefined;
export declare type PropIndexer = { [key: string]: IPropDeclaration };
export declare type NonNullableArbitraryValue = string | boolean | symbol | number | Function | object | IBindingIdentifier | ITypeBinding | {};
export declare type ArbitraryValue = NonNullableArbitraryValue | null | undefined;
export declare type ArbitraryValueIndexable = ArbitraryValue | IArbitraryObject<ArbitraryValue>;
export declare type ArbitraryValueArray = ArbitraryValueIndexable[];
export declare type InitializationValue = ArbitraryValueArray;

export interface ISimpleLanguageService extends LanguageServiceHost {
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	getFile(fileName: string): NodeArray<Statement>;
	getClassDeclarations(statements: (Statement | Expression | Node)[], deep?: boolean): ClassIndexer;
	getClassDeclarationsForFile(fileName: string, deep?: boolean): ClassIndexer;
	getAllIdentifiers(statements: (Statement | Expression | Node)[], deep?: boolean): IIdentifierMap;
	getAllIdentifiersForFile(fileName: string, deep?: boolean): IIdentifierMap;
	getVariableAssignments(statements: (Statement | Expression | Node)[], deep?: boolean): VariableIndexer;
	getVariableAssignmentsForFile(fileName: string, deep?: boolean): VariableIndexer;
	getEnumDeclarations(statements: (Statement | Expression | Node)[], deep?: boolean): EnumIndexer;
	getEnumDeclarationsForFile(fileName: string, deep?: boolean): EnumIndexer;
	getFunctionDeclarations(statements: (Statement | Expression | Node)[], deep?: boolean): FunctionIndexer;
	getFunctionDeclarationsForFile(fileName: string, deep?: boolean): FunctionIndexer;
	getImportDeclarationsForFile (fileName: string, deep?: boolean): IImportDeclaration[];
	getImportDeclarations(statements: (Statement | Expression | Node)[], deep?: boolean): IImportDeclaration[];
	getExportDeclarationsForFile (fileName: string, deep?: boolean): IExportDeclaration[];
	getExportDeclarations (statements: (Statement | Expression | Node)[], deep?: boolean): IExportDeclaration[];
	getCallExpressions(statements: (Statement | Expression | Node)[], deep?: boolean): ICallExpression[];
	getCallExpressionsForFile(fileName: string, deep?: boolean): ICallExpression[];
	getNewExpressions(statements: (Statement | Expression | Node)[], deep?: boolean): INewExpression[];
	getNewExpressionsForFile(fileName: string, deep?: boolean): INewExpression[];
}