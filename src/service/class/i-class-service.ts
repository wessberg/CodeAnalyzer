import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, GetAccessorDeclaration, HeritageClause, MethodDeclaration, PropertyDeclaration, SetAccessorDeclaration, SourceFile} from "typescript";
import {INodeService} from "../node/i-node-service";
import {IDecoratorCtor} from "../../light-ast/ctor/decorator/i-decorator-ctor";
import {IClassGetAccessorCtor, IClassSetAccessorCtor} from "../../light-ast/ctor/class-accessor/class-accessor-ctor";
import {IClassMethodCtor} from "../../light-ast/ctor/class-method/i-class-method-ctor";
import {IConstructorCtor} from "../../light-ast/ctor/constructor/i-constructor-ctor";
import {IClassPropertyCtor} from "../../light-ast/ctor/class-property/i-class-property-ctor";
import {INameWithTypeArguments} from "../../light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassCtor} from "../../light-ast/ctor/class/i-class-ctor";
import {IOwnOrInheritedMemberWithNameResult} from "./i-own-or-inherited-member-with-name-result";
import {IOwnOrInheritedPropertyWithNameResult} from "./i-own-or-inherited-property-with-name-result";
import {IOwnOrInheritedMethodWithNameResult} from "./i-own-or-inherited-method-with-name-result";
import {IOwnOrInheritedConstructorResult} from "./i-own-or-inherited-constructor-result";
import {IOwnOrInheritedGetterWithNameResult} from "./i-own-or-inherited-getter-with-name-result";
import {IOwnOrInheritedSetterWithNameResult} from "./i-own-or-inherited-setter-with-name-result";

export interface IClassService extends INodeService<ClassDeclaration|ClassExpression> {
	hasClassWithName (name: string, sourceFile: SourceFile, deep?: boolean): boolean;
	getClassWithName (name: string, sourceFile: SourceFile, deep?: boolean): ClassDeclaration|ClassExpression|undefined;
	getNameOfClass (classDeclaration: ClassDeclaration|ClassExpression): string|undefined;
	getExtendedClass (classDeclaration: ClassDeclaration|ClassExpression): HeritageClause|undefined;
	getNameOfExtendedClass (classDeclaration: ClassDeclaration|ClassExpression): string|undefined;
	resolveExtendedClass (classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression|undefined;
	getImplements (classDeclaration: ClassDeclaration|ClassExpression): HeritageClause|undefined;
	getConstructor (classDeclaration: ClassDeclaration|ClassExpression): ConstructorDeclaration|undefined;

	getMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassElement|undefined;
	getMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration|undefined;
	getPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration|undefined;
	getGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): GetAccessorDeclaration|undefined;
	getSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): SetAccessorDeclaration|undefined;

	getStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassElement|undefined;
	getStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration|undefined;
	getStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration|undefined;
	getStaticGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): GetAccessorDeclaration|undefined;
	getStaticSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): SetAccessorDeclaration|undefined;

	getOwnOrInheritedConstructor (classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedConstructorResult|undefined;

	getOwnOrInheritedMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedMemberWithNameResult|undefined;
	getOwnOrInheritedPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedPropertyWithNameResult|undefined;
	getOwnOrInheritedMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedMethodWithNameResult|undefined;
	getOwnOrInheritedGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedGetterWithNameResult|undefined;
	getOwnOrInheritedSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedSetterWithNameResult|undefined;

	getOwnOrInheritedStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedMemberWithNameResult|undefined;
	getOwnOrInheritedStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedPropertyWithNameResult|undefined;
	getOwnOrInheritedStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedMethodWithNameResult|undefined;
	getOwnOrInheritedStaticGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedGetterWithNameResult|undefined;
	getOwnOrInheritedStaticSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): IOwnOrInheritedSetterWithNameResult|undefined;

	getMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[];
	getPropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[];
	getMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[];
	getGettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): GetAccessorDeclaration[];
	getSettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): SetAccessorDeclaration[];

	getStaticMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[];
	getStaticPropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[];
	getStaticMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[];
	getStaticGettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): GetAccessorDeclaration[];
	getStaticSettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): SetAccessorDeclaration[];

	hasConstructor (classDeclaration: ClassDeclaration|ClassExpression): boolean;

	hasMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	hasStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasStaticGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasStaticSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	hasOwnOrInheritedConstructor (classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	hasOwnOrInheritedStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedStaticGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasOwnOrInheritedStaticSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	removeMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removePropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeGettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeSettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	removeStaticPropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticGettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticSettersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	removeMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removePropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	removeStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	isBaseClass (classDeclaration: ClassDeclaration|ClassExpression): boolean;
	isExtendingClassWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	isImplementingInterfaceWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	createClassDeclaration (options: IClassCtor): ClassDeclaration;
	createAndAddClassDeclarationToSourceFile (options: IClassCtor, sourceFile: SourceFile): ClassDeclaration;

	setNameOfClass (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	extendClassWith (name: INameWithTypeArguments, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	implementInterfaceOnClass (name: INameWithTypeArguments, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;

	addPropertyToClass (property: IClassPropertyCtor, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addConstructorToClass (constructor: IConstructorCtor, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addMethodToClass (method: IClassMethodCtor, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addSetterToClass (method: IClassSetAccessorCtor, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addGetterToClass (method: IClassGetAccessorCtor, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToMethod (methodName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToStaticMethod (methodName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToConstructor (instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToGetter (getterName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToSetter (setterName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
}