import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, ExpressionWithTypeArguments, NodeArray, SourceFile} from "typescript";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassPropertyDict} from "../../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../../dict/constructor/i-constructor-dict";
import {IClassMethodDict} from "../../dict/class-method/i-class-method-dict";
import {IClassGetAccessorDict, IClassSetAccessorDict} from "../../dict/class-accessor/class-accessor-dict";
import {IClassDict} from "../../dict/class/i-class-dict";

export interface IClassService {
	getClasses (sourceFile: SourceFile): NodeArray<ClassDeclaration|ClassExpression>;
	getNameOfClass (classDeclaration: ClassDeclaration|ClassExpression): string|undefined;
	getExtendedClass (classDeclaration: ClassDeclaration|ClassExpression): ExpressionWithTypeArguments|undefined;
	getImplements (classDeclaration: ClassDeclaration|ClassExpression): NodeArray<ExpressionWithTypeArguments>;
	getConstructor (classDeclaration: ClassDeclaration|ClassExpression): ConstructorDeclaration|undefined;
	getMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassElement|undefined;
	getStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassElement|undefined;

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
}