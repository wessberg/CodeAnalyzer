import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, HeritageClause, MethodDeclaration, PropertyDeclaration, SourceFile} from "typescript";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassPropertyDict} from "../../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../../dict/constructor/i-constructor-dict";
import {IClassMethodDict} from "../../dict/class-method/i-class-method-dict";
import {IClassGetAccessorDict, IClassSetAccessorDict} from "../../dict/class-accessor/class-accessor-dict";
import {IClassDict} from "../../dict/class/i-class-dict";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";
import {INodeService} from "../node/i-node-service";

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
	getStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassElement|undefined;
	getStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration|undefined;
	getStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration|undefined;

	getMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[];
	getStaticMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[];
	getPropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[];
	getStaticPropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[];
	getMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[];
	getStaticMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[];

	removeMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removePropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticPropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	removeMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removePropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	isBaseClass (classDeclaration: ClassDeclaration|ClassExpression): boolean;
	doesExtendClassWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	doesImplementInterfaceWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasConstructor (classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	hasSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean;

	createClassDeclaration (options: IClassDict): ClassDeclaration;
	createAndAddClassDeclarationToSourceFile (options: IClassDict, sourceFile: SourceFile): ClassDeclaration;

	setNameOfClass (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	extendClassWith (name: INameWithTypeArguments, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	implementInterfaceOnClass (name: INameWithTypeArguments, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addPropertyToClass (property: IClassPropertyDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addConstructorToClass (constructor: IConstructorDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addMethodToClass (method: IClassMethodDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addSetterToClass (method: IClassSetAccessorDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	addGetterToClass (method: IClassGetAccessorDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToMethod (methodName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToStaticMethod (methodName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
	appendInstructionsToConstructor (instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression;
}