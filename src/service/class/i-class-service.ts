import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, GetAccessorDeclaration, HeritageClause, MethodDeclaration, PropertyDeclaration, SetAccessorDeclaration, SourceFile} from "typescript";
import {INodeService} from "../node/i-node-service";
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
import {IPlacement} from "../../placement/i-placement";
import {IClassDict} from "../../light-ast/dict/class/i-class-dict";
import {DecoratorExpression} from "../decorator/i-decorator-service";

export type Class = ClassDeclaration|ClassExpression;

export interface IClassService extends INodeService<Class> {
	hasClassWithName (name: string, sourceFile: SourceFile, deep?: boolean): boolean;
	getClassWithName (name: string, sourceFile: SourceFile, deep?: boolean): Class|undefined;
	getNameOfClass (classDeclaration: Class): string|undefined;
	getExtendedClass (classDeclaration: Class): HeritageClause|undefined;
	getNameOfExtendedClass (classDeclaration: Class): string|undefined;
	resolveExtendedClass (classDeclaration: Class): Class|undefined;
	getImplements (classDeclaration: Class): HeritageClause|undefined;
	getConstructor (classDeclaration: Class): ConstructorDeclaration|undefined;

	getNameOfMember (member: ClassElement): string|undefined;
	getMemberNames (classDeclaration: Class): Set<string>;
	getOwnOrInheritedMemberNames (classDeclaration: Class): Set<string>;
	getOwnOrInheritedStaticMemberNames (classDeclaration: Class): Set<string>;
	getStaticMemberNames (classDeclaration: Class): Set<string>;

	getMemberWithName (name: string, classDeclaration: Class): ClassElement|undefined;
	getMethodWithName (name: string, classDeclaration: Class): MethodDeclaration|undefined;
	getPropertyWithName (name: string, classDeclaration: Class): PropertyDeclaration|undefined;
	getGetterWithName (name: string, classDeclaration: Class): GetAccessorDeclaration|undefined;
	getSetterWithName (name: string, classDeclaration: Class): SetAccessorDeclaration|undefined;

	getStaticMemberWithName (name: string, classDeclaration: Class): ClassElement|undefined;
	getStaticMethodWithName (name: string, classDeclaration: Class): MethodDeclaration|undefined;
	getStaticPropertyWithName (name: string, classDeclaration: Class): PropertyDeclaration|undefined;
	getStaticGetterWithName (name: string, classDeclaration: Class): GetAccessorDeclaration|undefined;
	getStaticSetterWithName (name: string, classDeclaration: Class): SetAccessorDeclaration|undefined;

	getOwnOrInheritedConstructor (classDeclaration: Class): IOwnOrInheritedConstructorResult|undefined;

	getOwnOrInheritedMemberWithName (name: string, classDeclaration: Class): IOwnOrInheritedMemberWithNameResult|undefined;
	getOwnOrInheritedPropertyWithName (name: string, classDeclaration: Class): IOwnOrInheritedPropertyWithNameResult|undefined;
	getOwnOrInheritedMethodWithName (name: string, classDeclaration: Class): IOwnOrInheritedMethodWithNameResult|undefined;
	getOwnOrInheritedGetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedGetterWithNameResult|undefined;
	getOwnOrInheritedSetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedSetterWithNameResult|undefined;

	getOwnOrInheritedStaticMemberWithName (name: string, classDeclaration: Class): IOwnOrInheritedMemberWithNameResult|undefined;
	getOwnOrInheritedStaticPropertyWithName (name: string, classDeclaration: Class): IOwnOrInheritedPropertyWithNameResult|undefined;
	getOwnOrInheritedStaticMethodWithName (name: string, classDeclaration: Class): IOwnOrInheritedMethodWithNameResult|undefined;
	getOwnOrInheritedStaticGetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedGetterWithNameResult|undefined;
	getOwnOrInheritedStaticSetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedSetterWithNameResult|undefined;

	getMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): ClassElement[];
	getPropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): PropertyDeclaration[];
	getMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): MethodDeclaration[];
	getGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): GetAccessorDeclaration[];
	getSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): SetAccessorDeclaration[];

	getStaticMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): ClassElement[];
	getStaticPropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): PropertyDeclaration[];
	getStaticMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): MethodDeclaration[];
	getStaticGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): GetAccessorDeclaration[];
	getStaticSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): SetAccessorDeclaration[];

	hasConstructor (classDeclaration: Class): boolean;

	hasMemberWithName (name: string, classDeclaration: Class): boolean;
	hasMethodWithName (name: string, classDeclaration: Class): boolean;
	hasPropertyWithName (name: string, classDeclaration: Class): boolean;
	hasGetterWithName (name: string, classDeclaration: Class): boolean;
	hasSetterWithName (name: string, classDeclaration: Class): boolean;

	hasStaticMemberWithName (name: string, classDeclaration: Class): boolean;
	hasStaticMethodWithName (name: string, classDeclaration: Class): boolean;
	hasStaticPropertyWithName (name: string, classDeclaration: Class): boolean;
	hasStaticGetterWithName (name: string, classDeclaration: Class): boolean;
	hasStaticSetterWithName (name: string, classDeclaration: Class): boolean;

	hasOwnOrInheritedConstructor (classDeclaration: Class): boolean;
	hasOwnOrInheritedMemberWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedPropertyWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedMethodWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedGetterWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedSetterWithName (name: string, classDeclaration: Class): boolean;

	hasOwnOrInheritedStaticMemberWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedStaticPropertyWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedStaticMethodWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedStaticGetterWithName (name: string, classDeclaration: Class): boolean;
	hasOwnOrInheritedStaticSetterWithName (name: string, classDeclaration: Class): boolean;

	removeMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removePropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removeMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removeGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removeSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;

	removeStaticPropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removeStaticMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removeStaticMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removeStaticGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;
	removeStaticSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean;

	removeMemberWithName (name: string, classDeclaration: Class): boolean;
	removePropertyWithName (name: string, classDeclaration: Class): boolean;
	removeMethodWithName (name: string, classDeclaration: Class): boolean;

	removeStaticPropertyWithName (name: string, classDeclaration: Class): boolean;
	removeStaticMemberWithName (name: string, classDeclaration: Class): boolean;
	removeStaticMethodWithName (name: string, classDeclaration: Class): boolean;

	isBaseClass (classDeclaration: Class): boolean;
	isExtendingClassWithName (name: string, classDeclaration: Class): boolean;
	isImplementingInterfaceWithName (name: string, classDeclaration: Class): boolean;

	createClassDeclaration (options: IClassCtor): ClassDeclaration;
	createAndAddClassDeclarationToSourceFile (options: IClassCtor, sourceFile: SourceFile, placement?: IPlacement): ClassDeclaration;

	setNameOfClass (name: string, classDeclaration: Class): Class;
	extendClassWith (name: INameWithTypeArguments, classDeclaration: Class): Class;
	implementInterfaceOnClass (name: INameWithTypeArguments, classDeclaration: Class): Class;

	addPropertyToClass (property: IClassPropertyCtor, classDeclaration: Class): Class;
	addConstructorToClass (constructor: IConstructorCtor, classDeclaration: Class): Class;
	addMethodToClass (method: IClassMethodCtor, classDeclaration: Class): Class;
	addSetterToClass (method: IClassSetAccessorCtor, classDeclaration: Class): Class;
	addGetterToClass (method: IClassGetAccessorCtor, classDeclaration: Class): Class;
	appendInstructionsToMethod (methodName: string, instructions: string, classDeclaration: Class): Class;
	appendInstructionsToStaticMethod (methodName: string, instructions: string, classDeclaration: Class): Class;
	appendInstructionsToConstructor (instructions: string, classDeclaration: Class): Class;
	appendInstructionsToGetter (getterName: string, instructions: string, classDeclaration: Class): Class;
	appendInstructionsToSetter (setterName: string, instructions: string, classDeclaration: Class): Class;

	toLightAST (node: Class): IClassDict;
}