import {AccessorDeclaration, BindingName, Block, CallExpression, ClassDeclaration, ClassElement, ConstructorDeclaration, Decorator, Expression, ExpressionWithTypeArguments, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportDeclaration, KeywordTypeNode, MethodDeclaration, Modifier, NamedExports, NamedImports, NamespaceImport, Node, NodeArray, ParameterDeclaration, PropertyDeclaration, SetAccessorDeclaration, Statement, StringLiteral, SyntaxKind, Token, TypeNode, TypeParameterDeclaration} from "typescript";
import {IImportCtor} from "../light-ast/ctor/import/i-import-ctor";
import {IImportClauseCtor} from "../light-ast/ctor/import-clause/i-import-clause-ctor";
import {INamedImportExportCtor} from "../light-ast/ctor/named-import-export/i-named-import-export-ctor";
import {AccessorCtor, IGetAccessorCtor, ISetAccessorCtor} from "../light-ast/ctor/accessor/accessor-ctor";
import {ClassAccessorCtor, IClassGetAccessorCtor, IClassSetAccessorCtor} from "../light-ast/ctor/class-accessor/class-accessor-ctor";
import {IMethodCtor} from "../light-ast/ctor/method/i-method-ctor";
import {IClassMethodCtor} from "../light-ast/ctor/class-method/i-class-method-ctor";
import {ClassElementCtor} from "../light-ast/ctor/class-element/class-element-ctor";
import {IClassPropertyCtor} from "../light-ast/ctor/class-property/i-class-property-ctor";
import {IClassCtor} from "../light-ast/ctor/class/i-class-ctor";
import {IConstructorCtor} from "../light-ast/ctor/constructor/i-constructor-ctor";
import {HeritageCtor, IExtendsHeritageCtor, IImplementsHeritageCtor} from "../light-ast/ctor/heritage/i-heritage-ctor";
import {INameWithTypeArguments} from "../light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";
import {ModifierKind} from "../light-ast/dict/modifier/modifier-kind";
import {IAllModifiersCtor} from "../light-ast/ctor/modifier/i-all-modifiers-ctor";
import {BindingNameCtor} from "../light-ast/ctor/binding-name/binding-name-ctor";
import {IParameterCtor} from "../light-ast/ctor/parameter/i-parameter-ctor";
import {IDecoratorCtor} from "../light-ast/ctor/decorator/i-decorator-ctor";
import {ICallExpressionCtor} from "../light-ast/ctor/call-expression/i-call-expression-ctor";

export interface IFormatterBase {
	formatUndefined (): KeywordTypeNode;
	formatImportDeclaration (options: IImportCtor): ImportDeclaration;
	formatImportClause ({namedImports, namespace, defaultName}: IImportClauseCtor): ImportClause;
	formatNamedImports (namedImports: INamedImportExportCtor|Iterable<INamedImportExportCtor>): NamedImports;
	formatNamedExports (namedExports: INamedImportExportCtor|Iterable<INamedImportExportCtor>): NamedExports;
	formatNamespaceImport (namespaceName: string): NamespaceImport;
	formatNodeArray <T extends Node> (nodes?: Iterable<T>|undefined): NodeArray<T>;

	formatAccessor (accessor: AccessorCtor): AccessorDeclaration;
	formatGetAccessor (accessor: IGetAccessorCtor): GetAccessorDeclaration;
	formatSetAccessor (accessor: ISetAccessorCtor): SetAccessorDeclaration;

	formatClassAccessor (accessor: ClassAccessorCtor): AccessorDeclaration;
	formatClassGetAccessor (accessor: IClassGetAccessorCtor): GetAccessorDeclaration;
	formatClassSetAccessor (accessor: IClassSetAccessorCtor): SetAccessorDeclaration;

	formatMethod (method: IMethodCtor): MethodDeclaration;
	formatClassMethod (method: IClassMethodCtor): MethodDeclaration;

	formatClassElement (member: ClassElementCtor): ClassElement;
	formatClassElements (members: Iterable<ClassElementCtor>): NodeArray<ClassElement>;

	formatClassProperty (property: IClassPropertyCtor): PropertyDeclaration;

	formatClassDeclaration (classDeclaration: IClassCtor): ClassDeclaration;

	formatConstructor (constructor: IConstructorCtor): ConstructorDeclaration;

	formatHeritageClause (clause: HeritageCtor): HeritageClause;
	formatHeritageClauses (clauses: Iterable<HeritageCtor>): NodeArray<HeritageClause>;
	formatExtendsHeritageClause (options: IExtendsHeritageCtor): HeritageClause;
	formatImplementsHeritageClause (options: IImplementsHeritageCtor): HeritageClause;

	formatExpressionWithTypeArguments (options: INameWithTypeArguments): ExpressionWithTypeArguments;

	formatModifier (modifier: ModifierKind): Modifier;
	formatModifiers (modifiers: Partial<IAllModifiersCtor>): NodeArray<Modifier>;

	formatBindingName (name: BindingNameCtor): BindingName;
	formatIdentifier (name: string): Identifier;

	formatParameter (parameter: IParameterCtor): ParameterDeclaration;
	formatParameters (parameters: Iterable<IParameterCtor>): NodeArray<ParameterDeclaration>;

	formatDecorator (decorator: IDecoratorCtor): Decorator;
	formatDecorators (decorators: Iterable<IDecoratorCtor>): NodeArray<Decorator>;

	formatDotDotDotToken (isRestSpread: boolean): Token<SyntaxKind.DotDotDotToken>|undefined;
	formatQuestionToken (isOptional: boolean): Token<SyntaxKind.QuestionToken>|undefined;
	formatExpression (expression: string): Expression;
	formatStatement (statement: string): Statement;
	formatType (type: string): TypeNode;
	formatTypes (types: Iterable<string>): NodeArray<TypeNode>;
	formatTypeParameter (type: string): TypeParameterDeclaration;
	formatTypeParameters (types: Iterable<string>): NodeArray<TypeParameterDeclaration>;
	formatCallExpression (callExpression: ICallExpressionCtor): CallExpression;

	formatBlock (block: string): Block;
	formatStringLiteral (literal: string): StringLiteral;
}