import {ArrayBindingPattern, ClassExpression, ArrayLiteralExpression, ArrayTypeNode, ArrowFunction, SyntaxKind, BinaryExpression, BindingName, BindingPattern, Block, BooleanLiteral, CallExpression, ClassDeclaration, ComputedPropertyName, ConditionalExpression, ConstructorDeclaration, Declaration, DeclarationName, ElementAccessExpression, EntityName, EnumDeclaration, ExportDeclaration, Expression, ExpressionStatement, FunctionExpression, HeritageClause, Identifier, ImportDeclaration, IndexSignatureDeclaration, IntersectionTypeNode, KeywordTypeNode, LanguageServiceHost, MethodDeclaration, NamedImports, NewExpression, Node, NodeArray, NoSubstitutionTemplateLiteral, NumericLiteral, ObjectBindingPattern, ObjectLiteralExpression, ParameterDeclaration, ParenthesizedExpression, PrefixUnaryExpression, PropertyAccessExpression, PropertyAssignment, PropertyDeclaration, PropertyName, PropertySignature, SpreadAssignment, SpreadElement, Statement, StringLiteral, TemplateExpression, TemplateHead, TemplateSpan, TemplateTail, ThisExpression, Token, TupleTypeNode, TypeAliasDeclaration, TypeAssertion, TypeLiteralNode, TypeNode, TypeReferenceNode, UnionTypeNode, VariableStatement, SourceFile, IfStatement, FunctionDeclaration, LabeledStatement, VariableDeclaration, ExpressionWithTypeArguments} from "typescript";

import {IBindingIdentifier} from "./IBindingIdentifier";

export declare type ResolvedMethodMap = { [key: string]: IMethodDeclaration };
export declare type AssignmentMap = { [key: string]: IVariableAssignment };
export declare type TypeArgument = string | boolean | symbol | number | null | undefined;

export interface IModuleDependency {
	relativePath: string;
	fullPath: string;
	bindings: string[];
}

export interface ICallExpression extends IArgumentsable, ICallable {
	type: ITypeable;
}

export interface ICallable {
	property: ArbitraryValue;
	identifier: NonNullableArbitraryValue;
}

export interface INewExpression extends IArgumentsable, ICallable {
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

export interface IMemberDeclaration extends IPositionable, IBodyable {
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

export interface IMethodDeclaration extends INameable, IMemberDeclaration, IParametersable {
	returnStatementStartsAt: number;
	returnStatementEndsAt: number;
	returnStatementContents: string | null;
}

export interface IConstructorDeclaration extends IMemberDeclaration, IParametersable {

}

export interface IHeritage {
	extendsClass: ITypeBinding | null;
	implementsInterfaces: ITypeBinding[];
}

export interface IClassDeclaration extends IMemberDeclaration, INameable, IFilePathable {
	methods: ResolvedMethodMap;
	props: PropIndexer;
	constructor: IConstructorDeclaration | null;
	heritage: IHeritage | null;
}

export interface IPositionable {
	startsAt: number;
	endsAt: number;
}

export declare interface IParameter extends IPositionable, INameable {
	type: ITypeable;
	value: IValueable;
}

export declare interface IArgument extends IPositionable {
	value: IValueable;
}

export interface IArbitraryObject<T> {
	[key: string]: T;
	[key: number]: T;
}

export interface IDecoratorsable {
	decorators: string[];
}

export declare interface IPropDeclaration extends IDecoratorsable, IPositionable, INameable {
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

export interface IValueable {
	resolved: ArbitraryValue | null;
	expression: InitializationValue | null;
}

export interface IVariableAssignment extends IPositionable, INameable {
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

export declare type PropIndexer = { [key: string]: IPropDeclaration };
export declare type NonNullableArbitraryValue = string | boolean | symbol | number | Function | object | IBindingIdentifier | ITypeBinding | {};
export declare type ArbitraryValue = NonNullableArbitraryValue | null | undefined;
export declare type ArbitraryValueIndexable = ArbitraryValue | IArbitraryObject<ArbitraryValue>;
export declare type ArbitraryValueArray = ArbitraryValueIndexable[];
export declare type InitializationValue = ArbitraryValueArray;

export interface ISimpleLanguageService extends LanguageServiceHost {
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	isObjectLiteralExpression (statement: Statement | Declaration | Expression | Node): statement is ObjectLiteralExpression;
	isVariableStatement(statement: Statement | Declaration | Expression | Node): statement is VariableStatement;
	isVariableDeclaration(statement: Statement | Declaration | Expression | Node): statement is VariableDeclaration;
	isFunctionDeclaration(statement: Statement | Declaration | Expression | Node): statement is FunctionDeclaration;
	isPropertyAccessExpression (statement: Statement | Declaration | Expression | Node): statement is PropertyAccessExpression;
	isElementAccessExpression (statement: Statement | Declaration | Expression | Node): statement is ElementAccessExpression;
	isArrayLiteralExpression (statement: Statement | Declaration | Expression | Node): statement is ArrayLiteralExpression;
	isTypeAssertionExpression (statement: Statement | Declaration | Expression | Node): statement is TypeAssertion;
	isComputedPropertyName(statement: BindingName | EntityName | Expression | Node): statement is ComputedPropertyName;
	isLabeledStatement(statement: Statement | Declaration | Expression | Node): statement is LabeledStatement;
	isTemplateExpression (statement: Statement | Declaration | Expression | Node): statement is TemplateExpression;
	isNoSubstitutionTemplateLiteral (statement: Statement | Declaration | Expression | Node): statement is NoSubstitutionTemplateLiteral;
	isPropertyDeclaration (statement: Statement | Declaration | Expression | Node): statement is PropertyDeclaration;
	isTemplateSpan (statement: Statement | Declaration | Expression | Node): statement is TemplateSpan;
	isTemplateHead (statement: TypeNode | Statement | Declaration | Expression | Node): statement is TemplateHead;
	isTemplateTail (statement: TypeNode | Statement | Declaration | Expression | Node): statement is TemplateTail;
	isConditionalExpression (statement: Statement | Declaration | Expression | Node): statement is ConditionalExpression;
	isCallExpression (statement: Statement | Declaration | Expression | Node): statement is CallExpression;
	isPrefixUnaryExpression (statement: Statement | Declaration | Expression | Node): statement is PrefixUnaryExpression;
	isParenthesizedExpression (statement: Statement | Declaration | Expression | Node): statement is ParenthesizedExpression;
	isParameterDeclaration (statement: Statement | Declaration | Expression | Node): statement is ParameterDeclaration;
	isBinaryExpression (statement: Statement | Declaration | Expression | Node): statement is BinaryExpression;
	isImportDeclaration (statement: Statement | Declaration | Expression | Node): statement is ImportDeclaration;
	isEnumDeclaration (statement: Statement | Declaration | Expression | Node): statement is EnumDeclaration;
	isTrueKeyword (statement: Statement | Declaration | Expression | Node): statement is BooleanLiteral;
	isFalseKeyword (statement: Statement | Declaration | Expression | Node): statement is BooleanLiteral;
	isThisKeyword (statement: Statement | Declaration | Expression | Node): statement is ThisExpression;
	isExtendsClause (statement: Statement | Declaration | Expression | Node): statement is HeritageClause;
	isImplementsClause (statement: Statement | Declaration | Expression | Node): statement is HeritageClause;
	isUndefinedKeyword (statement: Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isNullKeyword (statement: Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isObjectKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isNumberKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isNeverKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isBooleanKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isAnyKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isVoidKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isSymbolKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isStringKeyword (statement: TypeNode | Statement | Declaration | Expression | Node): statement is KeywordTypeNode;
	isTypeNode (statement: ParameterDeclaration | TypeAliasDeclaration | TypeNode): statement is TypeNode;
	isTypeLiteralNode (statement: ParameterDeclaration | TypeReferenceNode | TypeNode | TypeAliasDeclaration): statement is TypeLiteralNode;
	isNumericLiteral (statement: TypeNode | Statement | Declaration | Expression | Node): statement is NumericLiteral;
	isStringLiteral (statement: TypeNode | Statement | Declaration | Expression | Node): statement is StringLiteral;
	isPropertyAssignment (statement: Statement | Declaration | Expression | Node): statement is PropertyAssignment;
	isClassDeclaration(statement: Statement | Declaration | Expression | Node): statement is ClassDeclaration;
	isClassExpression(statement: Statement | Declaration | Expression | Node): statement is ClassExpression;
	isMethodDeclaration (statement: Statement | Declaration | Expression | Node): statement is MethodDeclaration;
	isBlockDeclaration (statement: Statement | Declaration | Expression | Node): statement is Block;
	isNamedImports (statement: Statement | Declaration | Expression | Node): statement is NamedImports;
	isExportDeclaration (statement: Statement | Declaration | Expression | Node): statement is ExportDeclaration;
	isExpressionStatement (statement: Statement | Declaration | Expression | Node): statement is ExpressionStatement;
	isTypeReference (statement: ParameterDeclaration | TypeReferenceNode | TypeNode | TypeAliasDeclaration): statement is TypeReferenceNode;
	isIdentifierObject (statement: BindingName | EntityName | Expression | Node): statement is Identifier;
	isTokenObject (statement: BindingName | EntityName | Expression | Node): statement is Token<SyntaxKind>;
	isConstructorDeclaration (statement: Statement | Declaration | Expression | Node): statement is ConstructorDeclaration;
	isNewExpression (statement: Statement | Declaration | Expression | Node): statement is NewExpression;
	isIndexSignatureDeclaration (statement: Declaration): statement is IndexSignatureDeclaration;
	isPropertySignature (statement: Statement | Declaration | Expression | Node): statement is PropertySignature;
	isTypeReferenceNode (statement: Statement | Declaration | Expression | Node): statement is TypeReferenceNode;
	isArrayTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is ArrayTypeNode;
	isTupleTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is TupleTypeNode;
	isSpreadAssignment (statement: Statement | Declaration | Expression | Node): statement is SpreadAssignment;
	isUnionTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is UnionTypeNode;
	isIntersectionTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is IntersectionTypeNode;
	isFirstLiteralToken (statement: BindingName | EntityName | Expression | Node): statement is Token<SyntaxKind.FirstLiteralToken> & { text: string };
	isPropertyName (statement: Expression | Node): statement is PropertyName;
	isDeclarationName(statement: Expression | Node): statement is DeclarationName;
	isExpressionWithTypeArguments(statement: ParameterDeclaration | TypeReferenceNode | TypeNode | TypeAliasDeclaration): statement is ExpressionWithTypeArguments;
	isBindingPattern (statement: TypeNode | Statement | Declaration | Expression | Node): statement is BindingPattern;
	isArrayBindingPattern (statement: TypeNode | Statement | Declaration | Expression | Node): statement is ArrayBindingPattern;
	isObjectBindingPattern(statement: TypeNode | Statement | Declaration | Expression | Node): statement is ObjectBindingPattern;
	isIfStatement(statement: Statement | Declaration | Expression | Node): statement is IfStatement;
	isSourceFile(statement: Statement | Declaration | Expression | Node): statement is SourceFile;
	isArrowFunction (statement: Statement | Declaration | Expression | Node): statement is ArrowFunction;
	isSpreadElement (statement: Statement | Declaration | Expression | Node): statement is SpreadElement;
	isFunctionExpression (statement: Statement | Declaration | Expression | Node): statement is FunctionExpression;
	serializeToken (token: SyntaxKind): string;
	marshalToken (token: SyntaxKind): ArbitraryValue;
	getImportDeclaration (statement: Statement | Declaration | Expression | Node): IModuleDependency;
	getClassDeclaration (statement: Statement | Declaration | Expression | Node): IClassDeclaration | null;
	getClassDeclarations (statements: Statement[]): IClassDeclaration[];
	getVariableAssignments (statements: Statement[], deep?: boolean): AssignmentMap;
	getImportDeclarations (statements: Statement[]): IModuleDependency[];
	getExportDeclarations (statements: Statement[]): Set<string>;
	getCallExpressions(statements: Statement[]): ICallExpression[];
	getNewExpressions(statements: Statement[]): INewExpression[];
	getInitializedValue (rawStatement: Statement | Expression | Node, currentScope: string | null): InitializationValue;
}