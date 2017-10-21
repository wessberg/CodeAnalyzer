import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, HeritageClause, MethodDeclaration, PropertyDeclaration, SourceFile} from "typescript";
import {INodeService} from "../node/i-node-service";
import {IDecoratorCtor} from "../../light-ast/ctor/decorator/i-decorator-ctor";
import {IClassGetAccessorCtor, IClassSetAccessorCtor} from "../../light-ast/ctor/class-accessor/class-accessor-ctor";
import {IClassMethodCtor} from "../../light-ast/ctor/class-method/i-class-method-ctor";
import {IConstructorCtor} from "../../light-ast/ctor/constructor/i-constructor-ctor";
import {IClassPropertyCtor} from "../../light-ast/ctor/class-property/i-class-property-ctor";
import {INameWithTypeArguments} from "../../light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassCtor} from "../../light-ast/ctor/class/i-class-ctor";

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

	getMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[];
	getStaticMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[];
	getPropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[];
	getStaticPropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[];
	getMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[];
	getStaticMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[];

	removeMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMembersWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removePropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticPropertiesWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;
	removeStaticMethodsWithDecorator (decorator: string|IDecoratorCtor|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean;

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
}