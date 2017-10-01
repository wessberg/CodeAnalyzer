import {ClassDeclaration, ClassExpression, SourceFile} from "typescript";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassPropertyDict} from "../../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../../dict/constructor/i-constructor-dict";
import {IClassMethodDict} from "../../dict/class-method/i-class-method-dict";
import {IClassGetAccessorDict, IClassSetAccessorDict} from "../../dict/class-accessor/class-accessor-dict";
import {IClassHelper} from "@wessberg/typescript-ast-util";
import {IClassDict} from "../../dict/class/i-class-dict";

export interface IClassService extends IClassHelper {
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