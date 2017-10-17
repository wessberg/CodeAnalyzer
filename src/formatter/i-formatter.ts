import {AccessorDeclaration, BindingName, Block, ClassDeclaration, Node, ClassElement, ConstructorDeclaration, Decorator, Expression, ExpressionWithTypeArguments, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportDeclaration, MethodDeclaration, Modifier, NamedImports, NamespaceImport, NodeArray, ParameterDeclaration, PropertyDeclaration, SetAccessorDeclaration, Statement, StringLiteral, SyntaxKind, Token, TypeNode, TypeParameterDeclaration, KeywordTypeNode, NamedExports} from "typescript";
import {IImportDict} from "../dict/import/i-import-dict";
import {INamedImportExportDict} from "../dict/named-import-export/i-named-import-export-dict";
import {AccessorDict, IGetAccessorDict, ISetAccessorDict} from "../dict/accessor/accessor-dict";
import {ClassAccessorDict, IClassGetAccessorDict, IClassSetAccessorDict} from "../dict/class-accessor/class-accessor-dict";
import {IMethodDict} from "../dict/method/i-method-dict";
import {IClassMethodDict} from "../dict/class-method/i-class-method-dict";
import {ClassElementDict} from "../dict/class-element/class-element-dict";
import {IClassPropertyDict} from "../dict/class-property/i-class-property-dict";
import {IClassDict} from "../dict/class/i-class-dict";
import {IConstructorDict} from "../dict/constructor/i-constructor-dict";
import {INameWithTypeArguments} from "../dict/name-with-type-arguments/i-name-with-type-arguments";
import {ModifierKind} from "../dict/modifier/modifier-kind";
import {IAllModifiersDict} from "../dict/modifier/i-all-modifiers-dict";
import {BindingNameDict} from "../dict/binding-name/binding-name-dict";
import {ParameterDict} from "../dict/parameter/parameter-dict";
import {DecoratorDict} from "../dict/decorator/decorator-dict";
import {HeritageDict, IExtendsHeritageDict, IImplementsHeritageDict} from "../dict/heritage/i-heritage-clause-dict";
import {IImportClauseDict} from "../dict/import-clause/i-import-clause-dict";

export interface IFormatterBase {
	formatUndefined (): KeywordTypeNode;
	formatImportDeclaration (options: IImportDict): ImportDeclaration;
	formatImportClause ({namedImports, namespace, defaultName}: IImportClauseDict): ImportClause;
	formatNamedImports (namedImports: INamedImportExportDict|Iterable<INamedImportExportDict>): NamedImports;
	formatNamedExports (namedExports: INamedImportExportDict|Iterable<INamedImportExportDict>): NamedExports;
	formatNamespaceImport (namespaceName: string): NamespaceImport;
	formatNodeArray <T extends Node> (nodes?: Iterable<T>|undefined): NodeArray<T>;

	formatAccessor (accessor: AccessorDict): AccessorDeclaration;
	formatGetAccessor (accessor: IGetAccessorDict): GetAccessorDeclaration;
	formatSetAccessor (accessor: ISetAccessorDict): SetAccessorDeclaration;

	formatClassAccessor (accessor: ClassAccessorDict): AccessorDeclaration;
	formatClassGetAccessor (accessor: IClassGetAccessorDict): GetAccessorDeclaration;
	formatClassSetAccessor (accessor: IClassSetAccessorDict): SetAccessorDeclaration;

	formatMethod (method: IMethodDict): MethodDeclaration;
	formatClassMethod (method: IClassMethodDict): MethodDeclaration;

	formatClassElement (member: ClassElementDict): ClassElement;
	formatClassElements (members: Iterable<ClassElementDict>): NodeArray<ClassElement>;

	formatClassProperty (property: IClassPropertyDict): PropertyDeclaration;

	formatClassDeclaration (classDeclaration: IClassDict): ClassDeclaration;

	formatConstructor (constructor: IConstructorDict): ConstructorDeclaration;

	formatHeritageClause (clause: HeritageDict): HeritageClause;
	formatHeritageClauses (clauses: Iterable<HeritageDict>): NodeArray<HeritageClause>;
	formatExtendsHeritageClause (options: IExtendsHeritageDict): HeritageClause;
	formatImplementsHeritageClause (options: IImplementsHeritageDict): HeritageClause;

	formatExpressionWithTypeArguments (options: INameWithTypeArguments): ExpressionWithTypeArguments;

	formatModifier (modifier: ModifierKind): Modifier;
	formatModifiers (modifiers: Partial<IAllModifiersDict>): NodeArray<Modifier>;

	formatBindingName (name: BindingNameDict): BindingName;
	formatIdentifier (name: string): Identifier;

	formatParameter (parameter: ParameterDict): ParameterDeclaration;
	formatParameters (parameters: Iterable<ParameterDict>): NodeArray<ParameterDeclaration>;

	formatDecorator (decorator: DecoratorDict): Decorator;
	formatDecorators (decorators: Iterable<DecoratorDict>): NodeArray<Decorator>;

	formatDotDotDotToken (isRestSpread: boolean): Token<SyntaxKind.DotDotDotToken>|undefined;
	formatQuestionToken (isOptional: boolean): Token<SyntaxKind.QuestionToken>|undefined;
	formatExpression (expression: string): Expression;
	formatStatement (statement: string): Statement;
	formatType (type: string): TypeNode;
	formatTypes (types: Iterable<string>): NodeArray<TypeNode>;
	formatTypeParameter (type: string): TypeParameterDeclaration;
	formatTypeParameters (types: Iterable<string>): NodeArray<TypeParameterDeclaration>;

	formatBlock (block: string): Block;
	formatStringLiteral (literal: string): StringLiteral;
}