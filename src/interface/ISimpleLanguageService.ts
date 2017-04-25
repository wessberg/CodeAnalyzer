import {
	ArrayLiteralExpression,
	ArrayTypeNode,
	BinaryExpression,
	ComputedPropertyName,
	BindingName,
	PropertyName,
	BindingPattern,
	ObjectBindingPattern,
	ArrayBindingPattern,
	DeclarationName,
	NumericLiteral,
	TemplateHead,
	TemplateTail,
	StringLiteral,
	Block,
	BooleanLiteral,
	CallExpression,
	ClassDeclaration,
	ConditionalExpression,
	ConstructorDeclaration,
	Declaration,
	ElementAccessExpression,
	EntityName,
	EnumDeclaration,
	ExportDeclaration,
	Expression,
	ExpressionStatement,
	HeritageClause,
	Identifier,
	ImportDeclaration,
	IntersectionTypeNode,
	KeywordTypeNode,
	LanguageServiceHost,
	MethodDeclaration,
	NamedImports,
	NewExpression,
	Node,
	NodeArray,
	NoSubstitutionTemplateLiteral,
	ObjectLiteralExpression,
	ParameterDeclaration,
	ParenthesizedExpression,
	PrefixUnaryExpression,
	PropertyAccessExpression,
	PropertyAssignment,
	PropertyDeclaration,
	Statement,
	TemplateExpression,
	TemplateSpan,
	ThisExpression,
	TupleTypeNode,
	TypeAliasDeclaration,
	TypeAssertion,
	TypeNode,
	TypeReferenceNode,
	UnionTypeNode,
	VariableStatement
} from "typescript";

import {IBindingIdentifier} from "./IBindingIdentifier";

export enum SyntaxKind {
	Unknown = 0,
	EndOfFileToken = 1,
	SingleLineCommentTrivia = 2,
	MultiLineCommentTrivia = 3,
	NewLineTrivia = 4,
	WhitespaceTrivia = 5,
	ShebangTrivia = 6,
	ConflictMarkerTrivia = 7,
	NumericLiteral = 8,
	StringLiteral = 9,
	JsxText = 10,
	RegularExpressionLiteral = 11,
	NoSubstitutionTemplateLiteral = 12,
	TemplateHead = 13,
	TemplateMiddle = 14,
	TemplateTail = 15,
	OpenBraceToken = 16,
	CloseBraceToken = 17,
	OpenParenToken = 18,
	CloseParenToken = 19,
	OpenBracketToken = 20,
	CloseBracketToken = 21,
	DotToken = 22,
	DotDotDotToken = 23,
	SemicolonToken = 24,
	CommaToken = 25,
	LessThanToken = 26,
	LessThanSlashToken = 27,
	GreaterThanToken = 28,
	LessThanEqualsToken = 29,
	GreaterThanEqualsToken = 30,
	EqualsEqualsToken = 31,
	ExclamationEqualsToken = 32,
	EqualsEqualsEqualsToken = 33,
	ExclamationEqualsEqualsToken = 34,
	EqualsGreaterThanToken = 35,
	PlusToken = 36,
	MinusToken = 37,
	AsteriskToken = 38,
	AsteriskAsteriskToken = 39,
	SlashToken = 40,
	PercentToken = 41,
	PlusPlusToken = 42,
	MinusMinusToken = 43,
	LessThanLessThanToken = 44,
	GreaterThanGreaterThanToken = 45,
	GreaterThanGreaterThanGreaterThanToken = 46,
	AmpersandToken = 47,
	BarToken = 48,
	CaretToken = 49,
	ExclamationToken = 50,
	TildeToken = 51,
	AmpersandAmpersandToken = 52,
	BarBarToken = 53,
	QuestionToken = 54,
	ColonToken = 55,
	AtToken = 56,
	EqualsToken = 57,
	PlusEqualsToken = 58,
	MinusEqualsToken = 59,
	AsteriskEqualsToken = 60,
	AsteriskAsteriskEqualsToken = 61,
	SlashEqualsToken = 62,
	PercentEqualsToken = 63,
	LessThanLessThanEqualsToken = 64,
	GreaterThanGreaterThanEqualsToken = 65,
	GreaterThanGreaterThanGreaterThanEqualsToken = 66,
	AmpersandEqualsToken = 67,
	BarEqualsToken = 68,
	CaretEqualsToken = 69,
	Identifier = 70,
	BreakKeyword = 71,
	CaseKeyword = 72,
	CatchKeyword = 73,
	ClassKeyword = 74,
	ConstKeyword = 75,
	ContinueKeyword = 76,
	DebuggerKeyword = 77,
	DefaultKeyword = 78,
	DeleteKeyword = 79,
	DoKeyword = 80,
	ElseKeyword = 81,
	EnumKeyword = 82,
	ExportKeyword = 83,
	ExtendsKeyword = 84,
	FalseKeyword = 85,
	FinallyKeyword = 86,
	ForKeyword = 87,
	FunctionKeyword = 88,
	IfKeyword = 89,
	ImportKeyword = 90,
	InKeyword = 91,
	InstanceOfKeyword = 92,
	NewKeyword = 93,
	NullKeyword = 94,
	ReturnKeyword = 95,
	SuperKeyword = 96,
	SwitchKeyword = 97,
	ThisKeyword = 98,
	ThrowKeyword = 99,
	TrueKeyword = 100,
	TryKeyword = 101,
	TypeOfKeyword = 102,
	VarKeyword = 103,
	VoidKeyword = 104,
	WhileKeyword = 105,
	WithKeyword = 106,
	ImplementsKeyword = 107,
	InterfaceKeyword = 108,
	LetKeyword = 109,
	PackageKeyword = 110,
	PrivateKeyword = 111,
	ProtectedKeyword = 112,
	PublicKeyword = 113,
	StaticKeyword = 114,
	YieldKeyword = 115,
	AbstractKeyword = 116,
	AsKeyword = 117,
	AnyKeyword = 118,
	AsyncKeyword = 119,
	AwaitKeyword = 120,
	BooleanKeyword = 121,
	ConstructorKeyword = 122,
	DeclareKeyword = 123,
	GetKeyword = 124,
	IsKeyword = 125,
	KeyOfKeyword = 126,
	ModuleKeyword = 127,
	NamespaceKeyword = 128,
	NeverKeyword = 129,
	ReadonlyKeyword = 130,
	RequireKeyword = 131,
	NumberKeyword = 132,
	ObjectKeyword = 133,
	SetKeyword = 134,
	StringKeyword = 135,
	SymbolKeyword = 136,
	TypeKeyword = 137,
	UndefinedKeyword = 138,
	FromKeyword = 139,
	GlobalKeyword = 140,
	OfKeyword = 141,
	QualifiedName = 142,
	ComputedPropertyName = 143,
	TypeParameter = 144,
	Parameter = 145,
	Decorator = 146,
	PropertySignature = 147,
	PropertyDeclaration = 148,
	MethodSignature = 149,
	MethodDeclaration = 150,
	Constructor = 151,
	GetAccessor = 152,
	SetAccessor = 153,
	CallSignature = 154,
	ConstructSignature = 155,
	IndexSignature = 156,
	TypePredicate = 157,
	TypeReference = 158,
	FunctionType = 159,
	ConstructorType = 160,
	TypeQuery = 161,
	TypeLiteral = 162,
	ArrayType = 163,
	TupleType = 164,
	UnionType = 165,
	IntersectionType = 166,
	ParenthesizedType = 167,
	ThisType = 168,
	TypeOperator = 169,
	IndexedAccessType = 170,
	MappedType = 171,
	LiteralType = 172,
	ObjectBindingPattern = 173,
	ArrayBindingPattern = 174,
	BindingElement = 175,
	ArrayLiteralExpression = 176,
	ObjectLiteralExpression = 177,
	PropertyAccessExpression = 178,
	ElementAccessExpression = 179,
	CallExpression = 180,
	NewExpression = 181,
	TaggedTemplateExpression = 182,
	TypeAssertionExpression = 183,
	ParenthesizedExpression = 184,
	FunctionExpression = 185,
	ArrowFunction = 186,
	DeleteExpression = 187,
	TypeOfExpression = 188,
	VoidExpression = 189,
	AwaitExpression = 190,
	PrefixUnaryExpression = 191,
	PostfixUnaryExpression = 192,
	BinaryExpression = 193,
	ConditionalExpression = 194,
	TemplateExpression = 195,
	YieldExpression = 196,
	SpreadElement = 197,
	ClassExpression = 198,
	OmittedExpression = 199,
	ExpressionWithTypeArguments = 200,
	AsExpression = 201,
	NonNullExpression = 202,
	MetaProperty = 203,
	TemplateSpan = 204,
	SemicolonClassElement = 205,
	Block = 206,
	VariableStatement = 207,
	EmptyStatement = 208,
	ExpressionStatement = 209,
	IfStatement = 210,
	DoStatement = 211,
	WhileStatement = 212,
	ForStatement = 213,
	ForInStatement = 214,
	ForOfStatement = 215,
	ContinueStatement = 216,
	BreakStatement = 217,
	ReturnStatement = 218,
	WithStatement = 219,
	SwitchStatement = 220,
	LabeledStatement = 221,
	ThrowStatement = 222,
	TryStatement = 223,
	DebuggerStatement = 224,
	VariableDeclaration = 225,
	VariableDeclarationList = 226,
	FunctionDeclaration = 227,
	ClassDeclaration = 228,
	InterfaceDeclaration = 229,
	TypeAliasDeclaration = 230,
	EnumDeclaration = 231,
	ModuleDeclaration = 232,
	ModuleBlock = 233,
	CaseBlock = 234,
	NamespaceExportDeclaration = 235,
	ImportEqualsDeclaration = 236,
	ImportDeclaration = 237,
	ImportClause = 238,
	NamespaceImport = 239,
	NamedImports = 240,
	ImportSpecifier = 241,
	ExportAssignment = 242,
	ExportDeclaration = 243,
	NamedExports = 244,
	ExportSpecifier = 245,
	MissingDeclaration = 246,
	ExternalModuleReference = 247,
	JsxElement = 248,
	JsxSelfClosingElement = 249,
	JsxOpeningElement = 250,
	JsxClosingElement = 251,
	JsxAttribute = 252,
	JsxAttributes = 253,
	JsxSpreadAttribute = 254,
	JsxExpression = 255,
	CaseClause = 256,
	DefaultClause = 257,
	HeritageClause = 258,
	CatchClause = 259,
	PropertyAssignment = 260,
	ShorthandPropertyAssignment = 261,
	SpreadAssignment = 262,
	EnumMember = 263,
	SourceFile = 264,
	Bundle = 265,
	JSDocTypeExpression = 266,
	JSDocAllType = 267,
	JSDocUnknownType = 268,
	JSDocArrayType = 269,
	JSDocUnionType = 270,
	JSDocTupleType = 271,
	JSDocNullableType = 272,
	JSDocNonNullableType = 273,
	JSDocRecordType = 274,
	JSDocRecordMember = 275,
	JSDocTypeReference = 276,
	JSDocOptionalType = 277,
	JSDocFunctionType = 278,
	JSDocVariadicType = 279,
	JSDocConstructorType = 280,
	JSDocThisType = 281,
	JSDocComment = 282,
	JSDocTag = 283,
	JSDocAugmentsTag = 284,
	JSDocParameterTag = 285,
	JSDocReturnTag = 286,
	JSDocTypeTag = 287,
	JSDocTemplateTag = 288,
	JSDocTypedefTag = 289,
	JSDocPropertyTag = 290,
	JSDocTypeLiteral = 291,
	JSDocLiteralType = 292,
	SyntaxList = 293,
	NotEmittedStatement = 294,
	PartiallyEmittedExpression = 295,
	MergeDeclarationMarker = 296,
	EndOfDeclarationMarker = 297,
	Count = 298,
	FirstAssignment = 57,
	LastAssignment = 69,
	FirstCompoundAssignment = 58,
	LastCompoundAssignment = 69,
	FirstReservedWord = 71,
	LastReservedWord = 106,
	FirstKeyword = 71,
	LastKeyword = 141,
	FirstFutureReservedWord = 107,
	LastFutureReservedWord = 115,
	FirstTypeNode = 157,
	LastTypeNode = 172,
	FirstPunctuation = 16,
	LastPunctuation = 69,
	FirstToken = 0,
	LastToken = 141,
	FirstTriviaToken = 2,
	LastTriviaToken = 7,
	FirstLiteralToken = 8,
	LastLiteralToken = 12,
	FirstTemplateToken = 12,
	LastTemplateToken = 15,
	FirstBinaryOperator = 26,
	LastBinaryOperator = 69,
	FirstNode = 142,
	FirstJSDocNode = 266,
	LastJSDocNode = 292,
	FirstJSDocTagNode = 282,
	LastJSDocTagNode = 292
}

export declare type ResolvedMethodMap = { [key: string]: IMethodDeclaration };

export declare type AssignmentMap = { [key: string]: InitializationValue };
export declare type TypeArgument = string | boolean | symbol | number | null | undefined;

export interface IModuleDependency {
	relativePath: string;
	fullPath: string;
	bindings: string[];
}

export interface ICallExpressionArgument extends IPositionable {
	value: TypeArgument;
}

export interface IPropertyCallExpression {
	property: string;
	method: string;
	typeArguments: string[];
	callBlockPosition: IPositionable;
	args: ICallExpressionArgument[];
}

export interface IMemberDeclaration {
	fullStartsAt: number;
	fullEndsAt: number;
	bodyStartsAt: number;
	bodyEndsAt: number;
	fullContents: string;
	bodyContents: string | null;
}

export interface IMethodDeclaration extends IMemberDeclaration {
	returnStatementStartsAt: number;
	returnStatementEndsAt: number;
	returnStatementContents: string | null;
	returnStatementTemplateStringContentsStartsAt: number;
	returnStatementTemplateStringContentsEndsAt: number;
	returnStatementTemplateStringContents: string | null;
}

export interface IClassDeclaration extends IMemberDeclaration {
	name: string;
	filepath: string;
	methods: ResolvedMethodMap;
	derives: string | null;
	props: PropIndexer;
	constructorArguments: IConstructorArgument[];
}

export interface IPositionable {
	startsAt: number;
	endsAt: number;
}

export declare interface IConstructorArgument extends IPositionable {
	name: string;
	type: string | undefined;
	initializer: string | null;
}

export interface IArbitraryObject<T> {
	[key: string]: T;
	[key: number]: T;
}

export declare interface IPropDeclaration {
	decorators: string[];
	type: string | null;
}

export declare type PropIndexer = { [key: string]: IPropDeclaration };
export declare type ArbitraryValue = string|boolean|symbol|number|null|undefined|Function|object|IBindingIdentifier|{};
export declare type ArbitraryValueIndexable = ArbitraryValue|IArbitraryObject<ArbitraryValue>;
export declare type ArbitraryValueArray = ArbitraryValueIndexable[];
export declare type InitializationValue = ArbitraryValueArray;
export declare type NullableInitializationValue = InitializationValue | null;

export interface ISimpleLanguageService extends LanguageServiceHost {
	addFile (fileName: string, content: string, version?: number): NodeArray<Statement>;
	isObjectLiteralExpression (statement: Statement | Declaration | Expression | Node): statement is ObjectLiteralExpression;
	isVariableDeclaration (statement: Statement | Declaration | Expression | Node): statement is VariableStatement;
	isPropertyAccessExpression (statement: Statement | Declaration | Expression | Node): statement is PropertyAccessExpression;
	isElementAccessExpression (statement: Statement | Declaration | Expression | Node): statement is ElementAccessExpression;
	isArrayLiteralExpression (statement: Statement | Declaration | Expression | Node): statement is ArrayLiteralExpression;
	isTypeAssertionExpression (statement: Statement | Declaration | Expression | Node): statement is TypeAssertion;
	isComputedPropertyName (statement: BindingName | EntityName | Expression| Node): statement is ComputedPropertyName;
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
	isExtendsKeyword (statement: Statement | Declaration | Expression | Node): statement is HeritageClause;
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
	isNumericLiteral (statement: TypeNode | Statement | Declaration | Expression | Node): statement is NumericLiteral;
	isStringLiteral (statement: TypeNode | Statement | Declaration | Expression | Node): statement is StringLiteral;
	isPropertyAssignment (statement: Statement | Declaration | Expression | Node): statement is PropertyAssignment;
	isClassDeclaration (statement: Statement | Declaration | Expression | Node): statement is ClassDeclaration;
	isMethodDeclaration (statement: Statement | Declaration | Expression | Node): statement is MethodDeclaration;
	isBlockDeclaration (statement: Statement | Declaration | Expression | Node): statement is Block;
	isNamedImports (statement: Statement | Declaration | Expression | Node): statement is NamedImports;
	isExportDeclaration (statement: Statement | Declaration | Expression | Node): statement is ExportDeclaration;
	isExpressionStatement (statement: Statement | Declaration | Expression | Node): statement is ExpressionStatement;
	isTypeReference (statement: ParameterDeclaration | TypeReferenceNode | TypeNode | TypeAliasDeclaration): statement is TypeReferenceNode;
	isIdentifierObject (statement: BindingName | EntityName | Expression| Node): statement is Identifier;
	isConstructorDeclaration (statement: Statement | Declaration | Expression | Node): statement is ConstructorDeclaration;
	isNewExpression (statement: Statement | Declaration | Expression | Node): statement is NewExpression;
	isTypeReferenceNode (statement: Statement | Declaration | Expression | Node): statement is TypeReferenceNode;
	isArrayTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is ArrayTypeNode;
	isTupleTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is TupleTypeNode;
	isUnionTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is UnionTypeNode;
	isIntersectionTypeNode (statement: ParameterDeclaration | TypeNode | TypeAliasDeclaration): statement is IntersectionTypeNode;
	isPropertyName (statement: Expression|Node): statement is PropertyName;
	isDeclarationName (statement: Expression|Node): statement is DeclarationName;
	isBindingPattern (statement: TypeNode | Statement | Declaration | Expression | Node): statement is BindingPattern;
	isArrayBindingPattern (statement: TypeNode | Statement | Declaration | Expression | Node): statement is ArrayBindingPattern;
	isObjectBindingPattern (statement: TypeNode | Statement | Declaration | Expression | Node): statement is ObjectBindingPattern;
	getScope (statement: Statement | Declaration | Expression | Node): string | null;
	isStatic (statement: Statement | Declaration | Expression | Node): boolean;
	getName (statement: Statement | Declaration | Expression | Node, traceParentPath?: boolean): string | null;
	getDecorators (statement: Statement | Declaration | Expression | Node): string[];
	serializeToken (token: SyntaxKind): string;
	getImportDeclaration (statement: Statement | Declaration | Expression | Node, filepath: string): IModuleDependency;
	getClassDeclaration (statement: Statement | Declaration | Expression | Node, filepath: string, fileContents: string): IClassDeclaration | null;
	getClassDeclarations (statements: NodeArray<Statement>, filepath: string, code: string): IClassDeclaration[];
	getVariableAssignments (statements: NodeArray<Statement>): AssignmentMap;
	getImportDeclarations (statements: NodeArray<Statement>, filepath: string): IModuleDependency[];
	getExportDeclarations (statements: NodeArray<Statement>): Set<string>;
	getPropertyCallExpressions (statements: NodeArray<Statement>): IPropertyCallExpression[];
	getInitializedValue (rawStatement: Statement | Expression | Node, currentScope: string | null): NullableInitializationValue;
	join (value: InitializationValue, stringifyIdentifiers?: boolean): string | null;
}