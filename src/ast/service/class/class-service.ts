import {IClassService} from "./i-class-service";
import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, createNodeArray, ExpressionWithTypeArguments, isAccessor, isConstructorDeclaration, isGetAccessorDeclaration, isIdentifier, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration, isStringLiteral, NodeArray, SourceFile, SyntaxKind} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFormatter} from "../../formatter/i-formatter";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassPropertyDict} from "../../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../../dict/constructor/i-constructor-dict";
import {IClassMethodDict} from "../../dict/class-method/i-class-method-dict";
import {IClassGetAccessorDict, IClassSetAccessorDict} from "../../dict/class-accessor/class-accessor-dict";

export class ClassService implements IClassService {

	constructor (private astUtil: ITypescriptASTUtil,
							 private formatter: IFormatter) {
	}

	/**
	 * Gets all ClassDeclarations and ClassExpressions for the provided SourceFile
	 * @param {SourceFile} sourceFile
	 * @returns {NodeArray<ClassDeclaration|ClassExpression|ClassExpression>}
	 */
	public getClasses (sourceFile: SourceFile): NodeArray<ClassDeclaration|ClassExpression|ClassExpression> {
		return this.astUtil.getFilteredStatements(sourceFile.statements, [SyntaxKind.ClassDeclaration, SyntaxKind.ClassExpression]);
	}

	/**
	 * Gets the name of the provided class declaration, if it has any
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {string}
	 */
	public getNameOfClass (classDeclaration: ClassDeclaration|ClassExpression): string|undefined {
		return classDeclaration.name == null ? undefined : classDeclaration.name.text;
	}

	/**
	 * Gets the extended class of the provided class, if it has any
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public getExtendedClass (classDeclaration: ClassDeclaration|ClassExpression): ExpressionWithTypeArguments|undefined {
		// If no heritage clauses exist, the class doesn't extend anything
		if (classDeclaration.heritageClauses == null) return undefined;

		const extendsClass = classDeclaration.heritageClauses.find(clause => clause.token === SyntaxKind.ExtendsKeyword);

		// If none of the clauses were an 'extends' clause, the class doesn't extend anything
		if (extendsClass == null) return undefined;

		// Return the first extended class expression (there can only be 1)
		return extendsClass.types[0];
	}

	/**
	 * Gets all implemented interfaces of the provided ClassDeclaration|ClassExpression
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {NodeArray<ExpressionWithTypeArguments>}
	 */
	public getImplements (classDeclaration: ClassDeclaration|ClassExpression): NodeArray<ExpressionWithTypeArguments> {
		// If no heritage clauses exist, the class doesn't extend anything
		if (classDeclaration.heritageClauses == null) return createNodeArray();

		const extendsClass = classDeclaration.heritageClauses.find(clause => clause.token === SyntaxKind.ImplementsKeyword);

		// If none of the clauses were an 'extends' clause, the class doesn't extend anything
		if (extendsClass == null) return createNodeArray();

		// Return the first extended class expression (there can only be 1)
		return extendsClass.types;
	}

	/**
	 * Gets the constructor of the provided ClassDeclaration|ClassExpression
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ConstructorDeclaration}
	 */
	public getConstructor (classDeclaration: ClassDeclaration|ClassExpression): ConstructorDeclaration|undefined {
		return <ConstructorDeclaration|undefined> classDeclaration.members.find(member => isConstructorDeclaration(member));
	}

	/**
	 * Gets the member of the class with the provided name. In case there are multiple (such as will
	 * be the case with getters and setters, the first matched one will be returned).
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassElement}
	 */
	public getMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassElement|undefined {
		return classDeclaration.members.find(member => {
			if (isConstructorDeclaration(member)) {
				return name === "constructor";
			}

			else if (isMethodDeclaration(member) || isPropertyDeclaration(member) || isAccessor(member)) {
				return ((isIdentifier(member.name) || isStringLiteral(member.name)) && member.name.text === name);
			}
			return false;
		});
	}

	/**
	 * Returns true if the class doesn't extend any other class
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public isBaseClass (classDeclaration: ClassDeclaration|ClassExpression): boolean {
		return this.getExtendedClass(classDeclaration) == null;
	}

	/**
	 * Returns true if the provided class extends a class with the provided name
	 * @param {string} name
	 * @param {ts.ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public doesExtendClassWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const extendedClass = this.getExtendedClass(classDeclaration);
		// If the class doesn't extend anything, return false.
		if (extendedClass == null) return false;

		// It does if the expression is an identifier with text equal to the provided name
		return isIdentifier(extendedClass.expression) && extendedClass.expression.text === name;
	}

	/**
	 * Returns true if the provided class implements an interface with a name equal to the provided one
	 * @param {string} name
	 * @param {ts.ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public doesImplementInterfaceWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const implementedInterfaces = this.getImplements(classDeclaration);

		// It does if any of the implemented interfaces is an identifier with a name equal to the provided one
		return implementedInterfaces.some(implementedInterface => isIdentifier(implementedInterface.expression) && implementedInterface.expression.text === name);
	}

	/**
	 * Returns true if the provided class has a constructor
	 * @param {ts.ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public hasConstructor (classDeclaration: ClassDeclaration|ClassExpression): boolean {
		return this.getConstructor(classDeclaration) != null;
	}

	/**
	 * Returns true if the provided class has a member with a name equal to the provided one
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public hasMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		return this.getMemberWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the provided class has a getter with a name equal to the provided one
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public hasGetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		return classDeclaration.members.find(member => isGetAccessorDeclaration(member) && (isIdentifier(member.name) || isStringLiteral(member.name)) && member.name.text === name) != null;
	}

	/**
	 * Returns true if the provided class has a setter with a name equal to the provided one
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public hasSetterWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		return classDeclaration.members.find(member => isSetAccessorDeclaration(member) && (isIdentifier(member.name) || isStringLiteral(member.name)) && member.name.text === name) != null;
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

	public extendClassWith (name: INameWithTypeArguments, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already extends something matching the provided name, return the existing class declaration
		if (this.doesExtendClassWithName(name.name, classDeclaration)) return classDeclaration;
		return this.formatter.updateClass({extendsClass: name}, classDeclaration);
	}

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