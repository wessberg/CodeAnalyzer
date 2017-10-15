import {IClassService} from "./i-class-service";
import {ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, HeritageClause, isAccessor, isConstructorDeclaration, isGetAccessorDeclaration, isIdentifier, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration, isStringLiteral, MethodDeclaration, Node, PropertyDeclaration, SourceFile, SyntaxKind} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {INameWithTypeArguments} from "../../dict/name-with-type-arguments/i-name-with-type-arguments";
import {IClassPropertyDict} from "../../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../../dict/constructor/i-constructor-dict";
import {IClassMethodDict} from "../../dict/class-method/i-class-method-dict";
import {IClassGetAccessorDict, IClassSetAccessorDict} from "../../dict/class-accessor/class-accessor-dict";
import {IClassDict} from "../../dict/class/i-class-dict";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {HeritageKind} from "../../dict/heritage/heritage-kind";
import {IMethodService} from "../method/i-method-service";
import {IConstructorService} from "../constructor/i-constructor-service";
import {DecoratorDict} from "../../dict/decorator/decorator-dict";
import {IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {NodeService} from "../node/node-service";
import {IModifierService} from "../modifier/i-modifier-service";

/**
 * A class for working with classes
 */
export class ClassService extends NodeService<ClassDeclaration|ClassExpression> implements IClassService {
	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {SyntaxKind[]}
	 */
	protected readonly ALLOWED_KINDS = [SyntaxKind.ClassExpression, SyntaxKind.ClassDeclaration];

	constructor (private formatter: IFormatter,
							 private updater: IUpdater,
							 private joiner: IJoiner,
							 private methodService: IMethodService,
							 private modifierService: IModifierService,
							 private constructorService: IConstructorService,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 decoratorService: IDecoratorService) {
		super(decoratorService, remover, astUtil);
	}

	/**
	 * Removes the ClassElement with the provided name, if any exists
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const member = this.getMemberWithName(name, classDeclaration);
		if (member == null) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			[member]
		);
	}

	/**
	 * Removes the static ClassElement with the provided name, if any exists
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const member = this.getStaticMemberWithName(name, classDeclaration);
		if (member == null) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			[member]
		);
	}

	/**
	 * Removes the PropertyDeclaration with the provided name, if any exists
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removePropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const property = this.getPropertyWithName(name, classDeclaration);
		if (property == null) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			[property]
		);
	}

	/**
	 * Removes the static PropertyDeclaration with the provided name, if any exists
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const property = this.getStaticPropertyWithName(name, classDeclaration);
		if (property == null) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			[property]
		);
	}

	/**
	 * Removes the MethodDeclaration with the provided name, if any exists
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const method = this.getMethodWithName(name, classDeclaration);
		if (method == null) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			[method]
		);
	}

	/**
	 * Removes the static MethodDeclaration with the provided name, if any exists
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const method = this.getStaticMethodWithName(name, classDeclaration);
		if (method == null) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			[method]
		);
	}

	/**
	 * Removes all non-static class members that matches the provided decorator
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const members = this.getMembersWithDecorator(decorator, classDeclaration);
		if (members.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			members
		);
	}

	/**
	 * Removes all static class members that matches the provided decorator
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const members = this.getStaticMembersWithDecorator(decorator, classDeclaration);
		if (members.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			members
		);
	}

	/**
	 * Removes all non-static class properties that matches the provided decorator
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removePropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const properties = this.getPropertiesWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes all static class properties that matches the provided decorator
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticPropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const properties = this.getStaticPropertiesWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes all non-static class methods that matches the provided decorator
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const methods = this.getMethodsWithDecorator(decorator, classDeclaration);
		if (methods.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			methods
		);
	}

	/**
	 * Removes all static class methods that matches the provided decorator
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const methods = this.getStaticMethodsWithDecorator(decorator, classDeclaration);
		if (methods.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			methods
		);
	}

	/**
	 * Returns all of the Class members that is decorated with the provided decorator
	 * @param {string | DecoratorDict} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {ClassElement[]}
	 */
	public getMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[] {
		return classDeclaration.members.filter(member => this.decoratorService.hasDecoratorWithExpression(decorator, member));
	}

	/**
	 * Returns all static members that is decorated with the provided decorator
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {ClassElement[]}
	 */
	public getStaticMembersWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): ClassElement[] {
		return this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are non-static PropertyDeclarations
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {PropertyDeclaration[]}
	 */
	public getPropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[] {
		return <PropertyDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isPropertyDeclaration(member) && !this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are static PropertyDeclarations
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {PropertyDeclaration[]}
	 */
	public getStaticPropertiesWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration[] {
		return <PropertyDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isPropertyDeclaration(member) && this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are non-static MethodDeclarations
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {MethodDeclaration[]}
	 */
	public getMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[] {
		return <MethodDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isMethodDeclaration(member) && !this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are static MethodDeclarations
	 * @param {string | DecoratorDict | RegExp} decorator
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {MethodDeclaration[]}
	 */
	public getStaticMethodsWithDecorator (decorator: string|DecoratorDict|RegExp, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration[] {
		return <MethodDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isMethodDeclaration(member) && this.modifierService.isStatic(member));
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
	public getExtendedClass (classDeclaration: ClassDeclaration|ClassExpression): HeritageClause|undefined {
		// If no heritage clauses exist, the class doesn't extend anything
		if (classDeclaration.heritageClauses == null) return undefined;

		const extendsClass = classDeclaration.heritageClauses.find(clause => clause.token === SyntaxKind.ExtendsKeyword);

		// If none of the clauses were an 'extends' clause, the class doesn't extend anything
		if (extendsClass == null) return undefined;

		// Return the first extended class expression (there can only be 1)
		return extendsClass;
	}

	/**
	 * Gets all implemented interfaces of the provided ClassDeclaration|ClassExpression
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {HeritageClause}
	 */
	public getImplements (classDeclaration: ClassDeclaration|ClassExpression): HeritageClause|undefined {
		// If no heritage clauses exist, the class doesn't extend anything
		if (classDeclaration.heritageClauses == null) return undefined;

		const implementsClause = classDeclaration.heritageClauses.find(clause => clause.token === SyntaxKind.ImplementsKeyword);

		// If none of the clauses were an 'implements' clause, the class doesn't extend anything
		if (implementsClause == null) return undefined;

		// Return the first extended class expression (there can only be 1)
		return implementsClause;
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

			return this.matchesMemberName(name, member);
		});
	}

	/**
	 * Gets the static member of the class with the provided name. In case there are multiple (such as will
	 * be the case with getters and setters, the first matched one will be returned).
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassElement}
	 */
	public getStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassElement|undefined {
		return classDeclaration.members.find(member => {
			if (isConstructorDeclaration(member)) {
				return name === "constructor";
			}

			return this.matchesStaticMemberName(name, member);
		});
	}

	/**
	 * Gets the MethodDeclaration from the provided ClassDeclaration or ClassExpression that matches the provided name
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {MethodDeclaration}
	 */
	public getMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration|undefined {
		return <MethodDeclaration|undefined> classDeclaration.members.find(member => isMethodDeclaration(member) && this.matchesMemberName(name, member));
	}

	/**
	 * Gets the PropertyDeclaration from the provided ClassDeclaration or ClassExpression that matches the provided name
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {PropertyDeclaration}
	 */
	public getPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration|undefined {
		return <PropertyDeclaration|undefined> classDeclaration.members.find(member => isPropertyDeclaration(member) && this.matchesMemberName(name, member));
	}

	/**
	 * Gets the (static) MethodDeclaration from the provided ClassDeclaration or ClassExpression that matches the provided name
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {MethodDeclaration}
	 */
	public getStaticMethodWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): MethodDeclaration|undefined {
		return <MethodDeclaration|undefined> classDeclaration.members.find(member => isMethodDeclaration(member) && this.matchesStaticMemberName(name, member));
	}

	/**
	 * Gets the (static) PropertyDeclaration from the provided ClassDeclaration or ClassExpression that matches the provided name
	 * @param {string} name
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {PropertyDeclaration}
	 */
	public getStaticPropertyWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): PropertyDeclaration|undefined {
		return <PropertyDeclaration|undefined> classDeclaration.members.find(member => isPropertyDeclaration(member) && this.matchesStaticMemberName(name, member));
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

		// Take the first extends type (there can only be one)
		const [firstType] = extendedClass.types;

		// It does if the expression is an identifier with text equal to the provided name
		return isIdentifier(firstType.expression) && firstType.expression.text === name;
	}

	/**
	 * Returns true if the provided class implements an interface with a name equal to the provided one
	 * @param {string} name
	 * @param {ts.ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public doesImplementInterfaceWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		const implementedInterfaces = this.getImplements(classDeclaration);
		if (implementedInterfaces == null) return false;

		// It does if any of the implemented interfaces is an identifier with a name equal to the provided one
		return implementedInterfaces.types.some(implementedInterface => isIdentifier(implementedInterface.expression) && implementedInterface.expression.text === name);
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
	 * Returns true if the provided class has a static member with a name equal to the provided one
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {boolean}
	 */
	public hasStaticMemberWithName (name: string, classDeclaration: ClassDeclaration|ClassExpression): boolean {
		return this.getStaticMemberWithName(name, classDeclaration) != null;
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
	 * Appends one or more instructions to the method on the class that matches the provided name
	 * @param {string} methodName
	 * @param {string} instructions
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {ClassDeclaration | ClassExpression}
	 */
	public appendInstructionsToMethod (methodName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		const method = this.getMethodWithName(methodName, classDeclaration);
		if (method == null) {
			throw new ReferenceError(`${this.constructor.name} could not find a method with the name: ${methodName}`);
		}

		// Append the instructions
		this.methodService.appendInstructions(instructions, method);

		// Return the original ClassDeclaration
		return classDeclaration;
	}

	/**
	 * Appends one or more instructions to the static method on the class that matches the provided name
	 * @param {string} methodName
	 * @param {string} instructions
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {ClassDeclaration | ClassExpression}
	 */
	public appendInstructionsToStaticMethod (methodName: string, instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		const method = this.getStaticMethodWithName(methodName, classDeclaration);
		if (method == null) {
			throw new ReferenceError(`${this.constructor.name} could not find a method with the name: ${methodName}`);
		}

		// Append the instructions
		this.methodService.appendInstructions(instructions, method);

		// Return the original ClassDeclaration
		return classDeclaration;
	}

	/**
	 * Appends one or more instructions to the constructor on the provide class
	 * @param {string} instructions
	 * @param {ClassDeclaration | ClassExpression} classDeclaration
	 * @returns {ClassDeclaration | ClassExpression}
	 */
	public appendInstructionsToConstructor (instructions: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		const constructor = this.getConstructor(classDeclaration);
		if (constructor == null) {
			throw new ReferenceError(`${this.constructor.name} could not find a constructor for the provided class`);
		}

		// Append the instructions
		this.constructorService.appendInstructions(instructions, constructor);

		// Return the original ClassDeclaration
		return classDeclaration;
	}

	/**
	 * Creates a new ClassDeclaration
	 * @param {IClassDict} options
	 * @returns {ClassDeclaration}
	 */
	public createClassDeclaration (options: IClassDict): ClassDeclaration {
		return this.formatter.formatClassDeclaration(options);
	}

	/**
	 * Creates a ClassDeclaration and adds it to the provided SourceFile
	 * @param {IClassDict} options
	 * @param {SourceFile} sourceFile
	 * @returns {ClassDeclaration}
	 */
	public createAndAddClassDeclarationToSourceFile (options: IClassDict, sourceFile: SourceFile): ClassDeclaration {
		const classDeclaration = this.createClassDeclaration(options);

		// Update the SourceFile to reflect the change
		this.updater.addStatement(
			classDeclaration,
			sourceFile
		);

		return classDeclaration;
	}

	/**
	 * Sets the name of a given ClassDeclaration|ClassExpression
	 * @param {string} name
	 * @param {ClassDeclaration|ClassExpression} classDeclaration
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public setNameOfClass (name: string, classDeclaration: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If the class already has the provided name, do nothing
		if (this.getNameOfClass(classDeclaration) === name) return classDeclaration;

		return this.updater.updateClassDeclarationName(
			this.formatter.formatIdentifier(name),
			classDeclaration
		);
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

		// Get the existing implements clause
		const existing = this.getImplements(classDeclaration);

		return this.updater.updateClassDeclarationHeritageClauses(
			this.joiner.joinHeritageClauses(
				this.formatter.formatExtendsHeritageClause({...name, kind: HeritageKind.EXTENDS}),
				existing
			),
			classDeclaration
		);
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

		// Generate a new HeritageClause
		const newClause = this.formatter.formatImplementsHeritageClause({kind: HeritageKind.IMPLEMENTS, elements: [name]});

		// Update the heritage clauses on the class
		return this.updater.updateClassDeclarationHeritageClauses(
			this.joiner.joinHeritageClauses(
				// Join the new implements clause with the existing ones
				this.joiner.joinImplementsHeritageClause(newClause, this.getImplements(classDeclaration)),
				// Also take the existing Extends heritage clause
				this.getExtendedClass(classDeclaration)
			),
			classDeclaration
		);
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

		// Create a PropertyDeclaration
		const formatted = this.formatter.formatClassProperty(property);

		// Merge the Property with the remaining ClassElements
		return this.updater.updateClassDeclarationMembers(
			this.joiner.joinClassElements(formatted, ...classDeclaration.members),
			classDeclaration
		);
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

		// Create a ConstructorDeclaration
		const formatted = this.formatter.formatConstructor(constructor);

		// Merge the ConstructorDeclaration with the remaining ClassElements
		return this.updater.updateClassDeclarationMembers(
			this.joiner.joinClassElements(formatted, ...classDeclaration.members),
			classDeclaration
		);
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

		// Create a MethodDeclaration
		const formatted = this.formatter.formatClassMethod(method);

		// Merge the MethodDeclaration with the remaining ClassElements
		return this.updater.updateClassDeclarationMembers(
			this.joiner.joinClassElements(formatted, ...classDeclaration.members),
			classDeclaration
		);
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

		// Create a SetAccessorDeclaration
		const formatted = this.formatter.formatClassSetAccessor(method);

		// Merge the SetAccessorDeclaration with the remaining ClassElements
		return this.updater.updateClassDeclarationMembers(
			this.joiner.joinClassElements(formatted, ...classDeclaration.members),
			classDeclaration
		);
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

		// Create a GetAccessorDeclaration
		const formatted = this.formatter.formatClassGetAccessor(method);

		// Merge the GetAccessorDeclaration with the remaining ClassElements
		return this.updater.updateClassDeclarationMembers(
			this.joiner.joinClassElements(formatted, ...classDeclaration.members),
			classDeclaration
		);
	}

	/**
	 * Returns true if provided member has the provided name
	 * @param {string} name
	 * @param {ClassElement} member
	 * @returns {boolean}
	 */
	private matchesMemberName (name: string, member: ClassElement): boolean {
		return (isMethodDeclaration(member) || isPropertyDeclaration(member) || isAccessor(member)) && ((isIdentifier(member.name) || isStringLiteral(member.name)) && member.name.text === name && !this.hasModifierWithKind(SyntaxKind.StaticKeyword, member));
	}

	/**
	 * Returns true if provided static member has the provided name
	 * @param {string} name
	 * @param {ClassElement} member
	 * @returns {boolean}
	 */
	private matchesStaticMemberName (name: string, member: ClassElement): boolean {
		return (isMethodDeclaration(member) || isPropertyDeclaration(member) || isAccessor(member)) && ((isIdentifier(member.name) || isStringLiteral(member.name)) && member.name.text === name && this.modifierService.isStatic(member));
	}

	/**
	 * Returns true if the class has a modifier with the provided kind
	 * @param {ts.SyntaxKind} kind
	 * @param {Node} classMember
	 * @returns {boolean}
	 */
	private hasModifierWithKind (kind: SyntaxKind, classMember: Node): boolean {
		if (classMember.modifiers == null) return false;
		return classMember.modifiers.find(modifier => modifier.kind === kind) != null;
	}
}