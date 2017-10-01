import {IClassService} from "./i-class-service";
import {ClassDeclaration, ClassExpression, SourceFile} from "typescript";
import {ClassHelper, INodeUpdaterUtil, ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassPropertyDict} from "../../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../../dict/constructor/i-constructor-dict";
import {IClassMethodDict} from "../../dict/class-method/i-class-method-dict";
import {IClassGetAccessorDict, IClassSetAccessorDict} from "../../dict/class-accessor/class-accessor-dict";
import {IClassDict} from "../../dict/class/i-class-dict";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IFormatter} from "../../formatter/i-formatter";

/**
 * A class for working with classes
 */
export class ClassService extends ClassHelper implements IClassService {
	constructor (private formatter: IFormatter,
							 private languageService: ITypescriptLanguageService,
							 private nodeUpdater: INodeUpdaterUtil,
							 astUtil: ITypescriptASTUtil) {
		super(astUtil);
	}

	/**
	 * Creates a new ClassDeclaration
	 * @param {IClassDict} options
	 * @returns {ClassDeclaration}
	 */
	public createClassDeclaration (options: IClassDict): ClassDeclaration {
		return <ClassDeclaration> this.formatter.formatClass(options);
	}

	/**
	 * Creates a ClassDeclaration and adds it to the provided SourceFile
	 * @param {IClassDict} options
	 * @param {SourceFile} sourceFile
	 * @returns {ClassDeclaration}
	 */
	public createAndAddClassDeclarationToSourceFile (options: IClassDict, sourceFile: SourceFile): ClassDeclaration {
		const classDeclaration = this.createClassDeclaration(options);
		return this.nodeUpdater.addInPlace(classDeclaration, sourceFile, this.languageService);
	}

	/**
	 * Sets the name of a given ClassDeclaration|ClassExpression
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public setNameOfClass (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		return this.formatter.updateClass({name}, classDeclaration);
	}

	/**
	 * Extends the provided class with the provided INameWithTypeArguments
	 * @param {INameWithTypeArguments} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {ClassDeclaration | ClassExpression}
	 */
	public extendClassWith (name: INameWithTypeArguments, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already extends something matching the provided name, return the existing class declaration
		if (this.doesExtendClassWithName(name.name, classDeclaration)) return classDeclaration;
		return this.formatter.updateClass({extendsClass: name}, classDeclaration);
	}

	/**
	 * Implements an interface with the provided INameWithTypeArguments on the provided class
	 * @param {INameWithTypeArguments} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {ClassDeclaration | ClassExpression}
	 */
	public implementInterfaceOnClass (name: INameWithTypeArguments, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already implements something matching the provided name, return the existing class declaration
		if (this.doesImplementInterfaceWithName(name.name, classDeclaration)) return classDeclaration;

		// Update the class with it
		return this.formatter.updateClass({implementsInterfaces: [name]}, classDeclaration);
	}

	/**
	 * Adds a new property to the given class
	 * @param {IClassPropertyDict} property
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public addPropertyToClass (property: IClassPropertyDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already has a member with the name of the property, do nothing
		if (this.hasMemberWithName(property.name, classDeclaration)) return classDeclaration;

		return this.formatter.updateClass({members: [property]}, classDeclaration);
	}

	/**
	 * Adds a Constructor to the given class
	 * @param {IConstructorDict} constructor
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public addConstructorToClass (constructor: IConstructorDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already has a member with the name of the property, do nothing
		if (this.hasConstructor(classDeclaration)) return classDeclaration;

		return this.formatter.updateClass({members: [constructor]}, classDeclaration);
	}

	/**
	 * Adds a method to the given class
	 * @param {IClassMethodDict} method
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public addMethodToClass (method: IClassMethodDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already has a member with the name of the property, do nothing
		if (this.hasMemberWithName(method.name, classDeclaration)) return classDeclaration;
		return this.formatter.updateClass({members: [method]}, classDeclaration);
	}

	/**
	 * Adds a setter to the provided class
	 * @param {IClassSetAccessorDict} method
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public addSetterToClass (method: IClassSetAccessorDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already has a member with the name of the property, do nothing
		if (this.hasSetterWithName(method.name, classDeclaration)) return classDeclaration;

		return this.formatter.updateClass({members: [method]}, classDeclaration);
	}

	/**
	 * Adds a getter to the provided class
	 * @param {IClassGetAccessorDict} method
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public addGetterToClass (method: IClassGetAccessorDict, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already has a member with the name of the property, do nothing
		if (this.hasGetterWithName(method.name, classDeclaration)) return classDeclaration;

		return this.formatter.updateClass({members: [method]}, classDeclaration);
	}
}