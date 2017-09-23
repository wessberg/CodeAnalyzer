import {ParameterDict} from "../dict/parameter/parameter-dict";
import {AccessorDeclaration, BindingName, ClassDeclaration, ClassExpression, ClassElement, ConstructorDeclaration, Decorator, Expression, GetAccessorDeclaration, HeritageClause, ImportDeclaration, MethodDeclaration, Modifier, NamedImports, NamespaceImport, NodeArray, ParameterDeclaration, PropertyDeclaration, SetAccessorDeclaration, SyntaxKind, Token, TypeNode, TypeParameterDeclaration} from "typescript";
import {DecoratorDict} from "../dict/decorator/decorator-dict";
import {BindingNameDict} from "../dict/binding-name/binding-name-dict";
import {IImportDict} from "../dict/import/i-import-dict";
import {AccessorDict, IGetAccessorDict, ISetAccessorDict} from "../dict/accessor/accessor-dict";
import {IAllModifiersDict} from "../dict/modifier/i-all-modifiers-dict";
import {ModifierKind} from "../dict/modifier/modifier-kind";
import {ClassAccessorDict, IClassGetAccessorDict, IClassSetAccessorDict} from "../dict/class-accessor/class-accessor-dict";
import {IMethodDict} from "../dict/method/i-method-dict";
import {IClassMethodDict} from "../dict/class-method/i-class-method-dict";
import {IClassPropertyDict} from "../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../dict/constructor/i-constructor-dict";
import {IClassDict} from "../dict/class/i-class-dict";
import {INameWithTypeArguments} from "../dict/name-with-type-arguments/i-name-with-type-arguments";
import {ClassElementDict} from "../dict/class-element/class-element-dict";

export interface IFormatter {
	formatImportDeclaration (options: IImportDict|ImportDeclaration): ImportDeclaration;
	updateImportDeclaration (options: Partial<IImportDict>, existing: ImportDeclaration): ImportDeclaration;
	formatNamedImports (namedImports: string|Iterable<string>|NamedImports): NamedImports;
	formatNamespaceImport (namespaceName: string|NamespaceImport): NamespaceImport;

	formatAccessor (accessor: AccessorDict|AccessorDeclaration): AccessorDeclaration;
	formatGetAccessor (accessor: IGetAccessorDict|GetAccessorDeclaration): GetAccessorDeclaration;
	formatSetAccessor (accessor: ISetAccessorDict|SetAccessorDeclaration): SetAccessorDeclaration;

	formatClassAccessor (accessor: ClassAccessorDict|AccessorDeclaration): AccessorDeclaration;
	formatClassGetAccessor (accessor: IClassGetAccessorDict|GetAccessorDeclaration): GetAccessorDeclaration;
	formatClassSetAccessor (accessor: IClassSetAccessorDict|SetAccessorDeclaration): SetAccessorDeclaration;

	formatMethod (method: IMethodDict|MethodDeclaration): MethodDeclaration;
	formatClassMethod (method: IClassMethodDict|MethodDeclaration): MethodDeclaration;

	formatClassElement (member: ClassElementDict|ClassElement): ClassElement;
	formatClassElements (members: Iterable<ClassElementDict|ClassElement>): NodeArray<ClassElement>;

	formatClassProperty (property: IClassPropertyDict|PropertyDeclaration): PropertyDeclaration;

	formatClass (classDeclaration: IClassDict|ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	updateClass (options: Partial<IClassDict>, existing: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;

	formatConstructor (constructor: IConstructorDict|ConstructorDeclaration): ConstructorDeclaration;

	formatHeritageClauses (extend: INameWithTypeArguments|HeritageClause|undefined|null, implement: INameWithTypeArguments|Iterable<INameWithTypeArguments>|HeritageClause|undefined|null, fillUndefinedFrom?: NodeArray<HeritageClause>): NodeArray<HeritageClause>;
	formatExtendsHeritageClause (extend: INameWithTypeArguments|HeritageClause): HeritageClause;
	formatImplementsHeritageClause (implement: INameWithTypeArguments|Iterable<INameWithTypeArguments>|HeritageClause): HeritageClause;

	formatModifier (modifier: ModifierKind): Modifier;
	formatModifiers (modifiers: Partial<IAllModifiersDict>): NodeArray<Modifier>;

	formatBindingName (name: BindingNameDict|BindingName): BindingName;

	formatParameter (parameter: ParameterDict|ParameterDeclaration): ParameterDeclaration;
	formatParameters (parameters: Iterable<ParameterDict|ParameterDeclaration>): NodeArray<ParameterDeclaration>;

	formatDecorator (decorator: DecoratorDict|Decorator): Decorator;
	formatDecorators (decorators: Iterable<DecoratorDict|Decorator>): NodeArray<Decorator>;

	formatDotDotDotToken (isRestSpread: boolean): Token<SyntaxKind.DotDotDotToken>|undefined;
	formatQuestionToken (isOptional: boolean): Token<SyntaxKind.QuestionToken>|undefined;
	formatExpression (expression: string): Expression;
	formatType (type: string): TypeNode;
	formatTypes (types: Iterable<string>): NodeArray<TypeNode>;
	formatTypeParameter (type: string): TypeParameterDeclaration;
	formatTypeParameters (types: Iterable<string>): NodeArray<TypeParameterDeclaration>;
}