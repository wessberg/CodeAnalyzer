import {Class, IClassService} from "./i-class-service";
import {ClassDeclaration, ClassElement, ConstructorDeclaration, createNodeArray, GetAccessorDeclaration, HeritageClause, isAccessor, isConstructorDeclaration, isGetAccessorDeclaration, isIdentifier, isMethodDeclaration, isPropertyDeclaration, isSetAccessorDeclaration, isStringLiteral, MethodDeclaration, Node, PropertyDeclaration, SetAccessorDeclaration, SourceFile, SyntaxKind} from "typescript";
import {ITypescriptASTUtil} from "@wessberg/typescript-ast-util";
import {IFormatter} from "../../formatter/i-formatter-getter";
import {IMethodService} from "../method/i-method-service";
import {IConstructorService} from "../constructor/i-constructor-service";
import {DecoratorExpression, IDecoratorService} from "../decorator/i-decorator-service";
import {IRemover} from "../../remover/i-remover-base";
import {IUpdater} from "../../updater/i-updater-getter";
import {IJoiner} from "../../joiner/i-joiner-getter";
import {NodeService} from "../node/node-service";
import {IModifierService} from "../modifier/i-modifier-service";
import {IResolver} from "../../resolver/i-resolver-getter";
import {IHeritageClauseService} from "../heritage-clause/i-heritage-clause-service";
import {IClassCtor} from "../../light-ast/ctor/class/i-class-ctor";
import {IConstructorCtor} from "../../light-ast/ctor/constructor/i-constructor-ctor";
import {IClassGetAccessorCtor, IClassSetAccessorCtor} from "../../light-ast/ctor/class-accessor/class-accessor-ctor";
import {IClassMethodCtor} from "../../light-ast/ctor/class-method/i-class-method-ctor";
import {IClassPropertyCtor} from "../../light-ast/ctor/class-property/i-class-property-ctor";
import {INameWithTypeArguments} from "../../light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";
import {ITypescriptLanguageService} from "@wessberg/typescript-language-service";
import {IOwnOrInheritedMemberWithNameResult} from "./i-own-or-inherited-member-with-name-result";
import {IOwnOrInheritedPropertyWithNameResult} from "./i-own-or-inherited-property-with-name-result";
import {IOwnOrInheritedMethodWithNameResult} from "./i-own-or-inherited-method-with-name-result";
import {IOwnOrInheritedConstructorResult} from "./i-own-or-inherited-constructor-result";
import {IOwnOrInheritedGetterWithNameResult} from "./i-own-or-inherited-getter-with-name-result";
import {IOwnOrInheritedSetterWithNameResult} from "./i-own-or-inherited-setter-with-name-result";
import {IGetAccessorService} from "../get-accessor/i-get-accessor-service";
import {ISetAccessorService} from "../set-accessor/i-set-accessor-service";
import {IPlacement} from "../../placement/i-placement";
import {IPropertyService} from "../property/i-property-service";
import {INodeToDictMapper} from "../../node-to-dict-mapper/i-node-to-dict-mapper-getter";
import {IClassDict} from "../../light-ast/dict/class/i-class-dict";

/**
 * A class for working with classes
 */
export class ClassService extends NodeService<Class> implements IClassService {

	/**
	 * The allowed SyntaxKinds when parsing a SourceFile for relevant Expressions
	 * @type {Iterable<SyntaxKind>}
	 */
	protected readonly ALLOWED_KINDS: Iterable<SyntaxKind> = [SyntaxKind.ClassExpression, SyntaxKind.ClassDeclaration];

	constructor (private readonly nodeToDictMapper: INodeToDictMapper,
							 private readonly formatter: IFormatter,
							 private readonly methodService: IMethodService,
							 private readonly propertyService: IPropertyService,
							 private readonly modifierService: IModifierService,
							 private readonly constructorService: IConstructorService,
							 private readonly heritageClauseService: IHeritageClauseService,
							 private readonly getAccessorService: IGetAccessorService,
							 private readonly setAccessorService: ISetAccessorService,
							 private readonly resolver: IResolver,
							 updater: IUpdater,
							 joiner: IJoiner,
							 astUtil: ITypescriptASTUtil,
							 remover: IRemover,
							 languageService: ITypescriptLanguageService,
							 decoratorService: IDecoratorService) {
		super(decoratorService, languageService, joiner, updater, remover, astUtil);
	}

	/**
	 * Returns the getter that matches the provided name, if it exists
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {GetAccessorDeclaration}
	 */
	public getGetterWithName (name: string, classDeclaration: Class): GetAccessorDeclaration|undefined {
		return <GetAccessorDeclaration|undefined> classDeclaration.members.find(member => isGetAccessorDeclaration(member) && this.matchesMemberName(name, member));
	}

	/**
	 * Returns the setter that matches the provided name, if it exists
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {SetAccessorDeclaration}
	 */
	public getSetterWithName (name: string, classDeclaration: Class): SetAccessorDeclaration|undefined {
		return <SetAccessorDeclaration|undefined> classDeclaration.members.find(member => isSetAccessorDeclaration(member) && this.matchesMemberName(name, member));
	}

	/**
	 * Returns the static getter that matches the provided name, if it exists
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {GetAccessorDeclaration}
	 */
	public getStaticGetterWithName (name: string, classDeclaration: Class): GetAccessorDeclaration|undefined {
		return <GetAccessorDeclaration|undefined> classDeclaration.members.find(member => isGetAccessorDeclaration(member) && this.matchesStaticMemberName(name, member));
	}

	/**
	 * Returns the static setter that matches the provided name, if it exists
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {SetAccessorDeclaration}
	 */
	public getStaticSetterWithName (name: string, classDeclaration: Class): SetAccessorDeclaration|undefined {
		return <SetAccessorDeclaration|undefined> classDeclaration.members.find(member => isSetAccessorDeclaration(member) && this.matchesStaticMemberName(name, member));
	}

	/**
	 * Gets all names of class members for the class - also those it inherits from its' parents
	 * @param {Class} classDeclaration
	 * @returns {Set<string>}
	 */
	public getOwnOrInheritedMemberNames (classDeclaration: Class): Set<string> {
		// Start with getting it's own member names
		const names = this.getMemberNames(classDeclaration);

		// If it is a base class, return the given names
		if (this.isBaseClass(classDeclaration)) return names;

		// Otherwise, resolve the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return its own names
		if (parentClass == null) return names;

		// Check recursively
		return new Set([...names, ...this.getOwnOrInheritedMemberNames(parentClass)]);
	}

	/**
	 * Gets all names of static class members for the class - also those it inherits from its' parents
	 * @param {Class} classDeclaration
	 * @returns {Set<string>}
	 */
	public getOwnOrInheritedStaticMemberNames (classDeclaration: Class): Set<string> {
		// Start with getting it's own member names
		const names = this.getStaticMemberNames(classDeclaration);

		// If it is a base class, return the given names
		if (this.isBaseClass(classDeclaration)) return names;

		// Otherwise, resolve the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return its own names
		if (parentClass == null) return names;

		// Check recursively
		return new Set([...names, ...this.getOwnOrInheritedStaticMemberNames(parentClass)]);
	}

	/**
	 * Gets all member names of the given ClassDeclaration
	 * @param {Class} classDeclaration
	 * @returns {Set<string>}
	 */
	public getMemberNames (classDeclaration: Class): Set<string> {
		const names: Set<string> = new Set();

		classDeclaration.members.forEach(member => {
			// If it is static, return immediately
			if (this.modifierService.isStatic(member)) return;

			// Get the name
			const name = this.getNameOfMember(member);

			// Add it if it has one
			if (name != null) names.add(name);
		});

		// Return the names
		return names;
	}

	/**
	 * Gets all member names of the given ClassDeclaration
	 * @param {Class} classDeclaration
	 * @returns {Set<string>}
	 */
	public getStaticMemberNames (classDeclaration: Class): Set<string> {
		const names: Set<string> = new Set();

		classDeclaration.members.forEach(member => {
			// If it is NOT static, return immediately
			if (!this.modifierService.isStatic(member)) return;

			// Get the name
			const name = this.getNameOfMember(member);

			// Add it if it has one
			if (name != null) names.add(name);
		});

		// Return the names
		return names;
	}

	/**
	 * Gets the name of the given member
	 * @param {ClassElement} member
	 * @returns {string|undefined}
	 */
	public getNameOfMember (member: ClassElement): string|undefined {
		if (isMethodDeclaration(member)) {
			return this.methodService.getName(member);
		}

		else if (isPropertyDeclaration(member)) {
			return this.propertyService.getName(member);
		}

		else if (isGetAccessorDeclaration(member)) {
			return this.getAccessorService.getName(member);
		}

		else if (isSetAccessorDeclaration(member)) {
			return this.setAccessorService.getName(member);
		}

		// Fall back to undefined
		return undefined;
	}

	/**
	 * Gets the getter matching the provided name, if it exists. Will resolve up through the inheritance chain
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedGetterWithNameResult}
	 */
	public getOwnOrInheritedGetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedGetterWithNameResult|undefined {
		// First, see if the class itself has it
		const getter = this.getGetterWithName(name, classDeclaration);

		// If so, return it
		if (getter != null) {
			return {
				isInherited: false,
				classDeclaration,
				getter
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedGetterWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			getter: result.getter
		};
	}

	/**
	 * Returns the getter matching the provided name, if it exists. Will resolve up through the inheritance chain
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedSetterWithNameResult}
	 */
	public getOwnOrInheritedSetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedSetterWithNameResult|undefined {
		// First, see if the class itself has it
		const setter = this.getSetterWithName(name, classDeclaration);

		// If so, return it
		if (setter != null) {
			return {
				isInherited: false,
				classDeclaration,
				setter
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedSetterWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			setter: result.setter
		};
	}

	/**
	 * Returns the getter matching the provided name, if it exists. Will resolve up through the inheritance chain
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedGetterWithNameResult}
	 */
	public getOwnOrInheritedStaticGetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedGetterWithNameResult|undefined {
		// First, see if the class itself has it
		const getter = this.getStaticGetterWithName(name, classDeclaration);

		// If so, return it
		if (getter != null) {
			return {
				isInherited: false,
				classDeclaration,
				getter
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedStaticGetterWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			getter: result.getter
		};
	}

	/**
	 * Returns the setter matching the provided name, if it exists. Will resolve up through the inheritance chain.
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedSetterWithNameResult}
	 */
	public getOwnOrInheritedStaticSetterWithName (name: string, classDeclaration: Class): IOwnOrInheritedSetterWithNameResult|undefined {
		// First, see if the class itself has it
		const setter = this.getStaticSetterWithName(name, classDeclaration);

		// If so, return it
		if (setter != null) {
			return {
				isInherited: false,
				classDeclaration,
				setter
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedStaticSetterWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			setter: result.setter
		};
	}

	/**
	 * Returns the getters that are decorated with the given decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {GetAccessorDeclaration[]}
	 */
	public getGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): GetAccessorDeclaration[] {
		return <GetAccessorDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isGetAccessorDeclaration(member) && !this.modifierService.isStatic(member));
	}

	/**
	 * Returns the setters that are decorated with the given decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {SetAccessorDeclaration[]}
	 */
	public getSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): SetAccessorDeclaration[] {
		return <SetAccessorDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isSetAccessorDeclaration(member) && !this.modifierService.isStatic(member));
	}

	/**
	 * Returns the static getters that are decorated with the given decorator.
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {GetAccessorDeclaration[]}
	 */
	public getStaticGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): GetAccessorDeclaration[] {
		return <GetAccessorDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isGetAccessorDeclaration(member) && this.modifierService.isStatic(member));
	}

	/**
	 * Returns the static setters that are decorated with the given decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {SetAccessorDeclaration[]}
	 */
	public getStaticSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): SetAccessorDeclaration[] {
		return <SetAccessorDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isSetAccessorDeclaration(member) && this.modifierService.isStatic(member));
	}

	/**
	 * Returns true if the class has a method matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasMethodWithName (name: string, classDeclaration: Class): boolean {
		return this.getMethodWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class has a property matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasPropertyWithName (name: string, classDeclaration: Class): boolean {
		return this.getPropertyWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class has a static method matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasStaticMethodWithName (name: string, classDeclaration: Class): boolean {
		return this.getStaticMethodWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class has a static property matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */

	public hasStaticPropertyWithName (name: string, classDeclaration: Class): boolean {
		return this.getStaticPropertyWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class has a static getter matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasStaticGetterWithName (name: string, classDeclaration: Class): boolean {
		return this.getStaticGetterWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class has a static setter matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasStaticSetterWithName (name: string, classDeclaration: Class): boolean {
		return this.getStaticSetterWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class or any of the classes it extends has a getter matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedGetterWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedGetterWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class or any of the classes it extends has a setter matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedSetterWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedSetterWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class or any of the classes it extends has a static getter matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedStaticGetterWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedStaticGetterWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the class or any of the classes it extends has a static setter matching the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedStaticSetterWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedStaticSetterWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the given class has or inherits a constructor
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedConstructor (classDeclaration: Class): boolean {
		return this.getOwnOrInheritedConstructor(classDeclaration) != null;
	}

	/**
	 * Returns true if the given class has or inherits a member with the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedMemberWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedMemberWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the given class has or inherits a static member with the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedStaticMemberWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedStaticMemberWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the given class has or inherits a property with the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedPropertyWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedPropertyWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the given class has or inherits a static property with the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedStaticPropertyWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedStaticPropertyWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the given class has or inherits a method with the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedMethodWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedMethodWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the given class has or inherits a static method with the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasOwnOrInheritedStaticMethodWithName (name: string, classDeclaration: Class): boolean {
		return this.getOwnOrInheritedStaticMethodWithName(name, classDeclaration) != null;
	}

	/**
	 * Gets the constructor of the class, if it has any. Will check up through the inheritance chain
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedConstructorResult}
	 */
	public getOwnOrInheritedConstructor (classDeclaration: Class): IOwnOrInheritedConstructorResult|undefined {
		// First, see if the class itself has it
		const constructor = this.getConstructor(classDeclaration);

		// If so, return it
		if (constructor != null) {
			return {
				isInherited: false,
				classDeclaration,
				constructor
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedConstructor(parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			constructor: result.constructor
		};
	}

	/**
	 * Gets the class member with the provided name. Will check up through the inheritance chain
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedMemberWithNameResult}
	 */
	public getOwnOrInheritedMemberWithName (name: string, classDeclaration: Class): IOwnOrInheritedMemberWithNameResult|undefined {
		// First, see if the class itself has it
		const member = this.getMemberWithName(name, classDeclaration);

		// If so, return it
		if (member != null) {
			return {
				isInherited: false,
				classDeclaration,
				member
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedMemberWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			member: result.member
		};
	}

	/**
	 * Gets the static class member with the provided name. Will check up through the inheritance chain
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedMemberWithNameResult}
	 */
	public getOwnOrInheritedStaticMemberWithName (name: string, classDeclaration: Class): IOwnOrInheritedMemberWithNameResult|undefined {
		// First, see if the class itself has it
		const member = this.getStaticMemberWithName(name, classDeclaration);

		// If so, return it
		if (member != null) {
			return {
				isInherited: false,
				classDeclaration,
				member
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedStaticMemberWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			member: result.member
		};
	}

	/**
	 * Gets the class property with the provided name, if any exists. Will check up through the inheritance chain.
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedPropertyWithNameResult}
	 */
	public getOwnOrInheritedPropertyWithName (name: string, classDeclaration: Class): IOwnOrInheritedPropertyWithNameResult|undefined {
		// First, see if the class itself has it
		const property = this.getPropertyWithName(name, classDeclaration);

		// If so, return it
		if (property != null) {
			return {
				isInherited: false,
				classDeclaration,
				property
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedPropertyWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			property: result.property
		};
	}

	/**
	 * Gets the static property with the provided name, if it exists. Will check up through the inheritance chain.
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedPropertyWithNameResult}
	 */
	public getOwnOrInheritedStaticPropertyWithName (name: string, classDeclaration: Class): IOwnOrInheritedPropertyWithNameResult|undefined {
		// First, see if the class itself has it
		const property = this.getStaticPropertyWithName(name, classDeclaration);

		// If so, return it
		if (property != null) {
			return {
				isInherited: false,
				classDeclaration,
				property
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedStaticPropertyWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			property: result.property
		};
	}

	/**
	 * Gets the method with the provided name, if any exists. Will check up through the inheritance chain.
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedMethodWithNameResult}
	 */
	public getOwnOrInheritedMethodWithName (name: string, classDeclaration: Class): IOwnOrInheritedMethodWithNameResult|undefined {
		// First, see if the class itself has it
		const method = this.getMethodWithName(name, classDeclaration);

		// If so, return it
		if (method != null) {
			return {
				isInherited: false,
				classDeclaration,
				method
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedMethodWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			method: result.method
		};
	}

	/**
	 * Gets the static method with the provided name. Will check up through the inheritance chain
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {IOwnOrInheritedMethodWithNameResult}
	 */
	public getOwnOrInheritedStaticMethodWithName (name: string, classDeclaration: Class): IOwnOrInheritedMethodWithNameResult|undefined {
		// First, see if the class itself has it
		const method = this.getStaticMethodWithName(name, classDeclaration);

		// If so, return it
		if (method != null) {
			return {
				isInherited: false,
				classDeclaration,
				method
			};
		}

		// Otherwise, check if the class extends anything. If it doesn't, return undefined
		if (this.isBaseClass(classDeclaration)) return undefined;

		// Result the parent class
		const parentClass = this.resolveExtendedClass(classDeclaration);

		// If the parent class couldn't be resolved somehow, return undefined
		if (parentClass == null) return undefined;

		// Check recursively
		const result = this.getOwnOrInheritedStaticMethodWithName(name, parentClass);

		// If no parent had it either, return undefined
		if (result == null) {
			return undefined;
		}

		// Otherwise, return the match
		return {
			isInherited: true,
			classDeclaration: result.classDeclaration,
			method: result.method
		};
	}

	/**
	 * Gets the name of the class that the given class extends
	 * @param {Class} classDeclaration
	 * @returns {string}
	 */
	public getNameOfExtendedClass (classDeclaration: Class): string|undefined {
		// If the class doesn't extend anything, return undefined
		if (this.isBaseClass(classDeclaration)) {
			return undefined;
		}

		// Get the HeritageClause for the extended class
		const extendedClass = this.getExtendedClass(classDeclaration);

		// If a HeritageClause couldn't be resolved, return undefined
		if (extendedClass == null) return undefined;

		// Take the first name. EcmaScript only supports inheritance from one class
		const [firstName] = this.heritageClauseService.getTypeNames(extendedClass);
		return firstName;
	}

	/**
	 * Resolves the parent class of the given ClassDeclaration or ClassExpression
	 * @param {Class} classDeclaration
	 * @returns {Class | undefined}
	 */
	public resolveExtendedClass (classDeclaration: Class): Class|undefined {
		// Get the name of the extended class
		const name = this.getNameOfExtendedClass(classDeclaration);

		// If a name could not be resolved, or if the class doesn't extend anything, return undefined
		if (name == null) return undefined;

		// Resolve it
		return <Class|undefined> this.resolver.resolve(name, classDeclaration.getSourceFile());
	}

	/**
	 * Returns true if the given SourceFile contains a ClassDeclaration or ClassExpression with the provided name
	 * @param {string} name
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {boolean}
	 */
	public hasClassWithName (name: string, sourceFile: SourceFile, deep: boolean = true): boolean {
		return this.getClassWithName(name, sourceFile, deep) != null;
	}

	/**
	 * Gets the ClassDeclaration or ClassExpression within the provided SourceFile with the provided name
	 * @param {string} name
	 * @param {SourceFile} sourceFile
	 * @param {boolean} deep
	 * @returns {Class}
	 */
	public getClassWithName (name: string, sourceFile: SourceFile, deep: boolean = true): Class|undefined {
		return this.getAll(sourceFile, deep)
			.find(classDeclaration => this.getNameOfClass(classDeclaration) === name);
	}

	/**
	 * Removes all getters that are decorated with the given decorator from the class.
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const properties = this.getGettersWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes all setters that are decorated with the given decorator from the class.
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const properties = this.getSettersWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes all static getters that are decorated with the given decorator from the class.
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticGettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const properties = this.getStaticGettersWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes all static setters that are decorated with the given decorator from the class.
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticSettersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const properties = this.getStaticSettersWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes the ClassElement with the provided name, if any exists
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeMemberWithName (name: string, classDeclaration: Class): boolean {
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
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMemberWithName (name: string, classDeclaration: Class): boolean {
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
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removePropertyWithName (name: string, classDeclaration: Class): boolean {
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
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticPropertyWithName (name: string, classDeclaration: Class): boolean {
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
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeMethodWithName (name: string, classDeclaration: Class): boolean {
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
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMethodWithName (name: string, classDeclaration: Class): boolean {
		const method = this.getStaticMethodWithName(name, classDeclaration);
		if (method == null) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			[method]
		);
	}

	/**
	 * Removes all non-static class members that matches the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const members = this.getMembersWithDecorator(decorator, classDeclaration);
		if (members.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			members
		);
	}

	/**
	 * Removes all static class members that matches the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const members = this.getStaticMembersWithDecorator(decorator, classDeclaration);
		if (members.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			members
		);
	}

	/**
	 * Removes all non-static class properties that matches the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removePropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const properties = this.getPropertiesWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes all static class properties that matches the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticPropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const properties = this.getStaticPropertiesWithDecorator(decorator, classDeclaration);
		if (properties.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			properties
		);
	}

	/**
	 * Removes all non-static class methods that matches the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const methods = this.getMethodsWithDecorator(decorator, classDeclaration);
		if (methods.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			methods
		);
	}

	/**
	 * Removes all static class methods that matches the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public removeStaticMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): boolean {
		const methods = this.getStaticMethodsWithDecorator(decorator, classDeclaration);
		if (methods.length === 0) return false;

		return this.remover.removeClassDeclarationMembers(
			classDeclaration,
			methods
		);
	}

	/**
	 * Returns all of the Class members that is decorated with the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {ClassElement[]}
	 */
	public getMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): ClassElement[] {
		return classDeclaration.members.filter(member => this.decoratorService.hasDecoratorWithExpression(decorator, member));
	}

	/**
	 * Returns all static members that is decorated with the provided decorator
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {ClassElement[]}
	 */
	public getStaticMembersWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): ClassElement[] {
		return this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are non-static PropertyDeclarations
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {PropertyDeclaration[]}
	 */
	public getPropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): PropertyDeclaration[] {
		return <PropertyDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isPropertyDeclaration(member) && !this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are static PropertyDeclarations
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {PropertyDeclaration[]}
	 */
	public getStaticPropertiesWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): PropertyDeclaration[] {
		return <PropertyDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isPropertyDeclaration(member) && this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are non-static MethodDeclarations
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {MethodDeclaration[]}
	 */
	public getMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): MethodDeclaration[] {
		return <MethodDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isMethodDeclaration(member) && !this.modifierService.isStatic(member));
	}

	/**
	 * Returns all members that are decorated with the provided decorator and are static MethodDeclarations
	 * @param {DecoratorExpression} decorator
	 * @param {Class} classDeclaration
	 * @returns {MethodDeclaration[]}
	 */
	public getStaticMethodsWithDecorator (decorator: DecoratorExpression, classDeclaration: Class): MethodDeclaration[] {
		return <MethodDeclaration[]> this.getMembersWithDecorator(decorator, classDeclaration)
			.filter(member => isMethodDeclaration(member) && this.modifierService.isStatic(member));
	}

	/**
	 * Gets the name of the provided class declaration, if it has any
	 * @param {Class} classDeclaration
	 * @returns {string}
	 */
	public getNameOfClass (classDeclaration: Class): string|undefined {
		return classDeclaration.name == null ? undefined : classDeclaration.name.text;
	}

	/**
	 * Gets the extended class of the provided class, if it has any
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public getExtendedClass (classDeclaration: Class): HeritageClause|undefined {
		// If no heritage clauses exist, the class doesn't extend anything
		if (classDeclaration.heritageClauses == null) return undefined;

		const extendsClass = classDeclaration.heritageClauses.find(clause => clause.token === SyntaxKind.ExtendsKeyword);

		// If none of the clauses were an 'extends' clause, the class doesn't extend anything
		if (extendsClass == null) return undefined;

		// Return the first extended class expression (there can only be 1)
		return extendsClass;
	}

	/**
	 * Gets all implemented interfaces of the provided Class
	 * @param {Class} classDeclaration
	 * @returns {HeritageClause}
	 */
	public getImplements (classDeclaration: Class): HeritageClause|undefined {
		// If no heritage clauses exist, the class doesn't extend anything
		if (classDeclaration.heritageClauses == null) return undefined;

		const implementsClause = classDeclaration.heritageClauses.find(clause => clause.token === SyntaxKind.ImplementsKeyword);

		// If none of the clauses were an 'implements' clause, the class doesn't extend anything
		if (implementsClause == null) return undefined;

		// Return the first extended class expression (there can only be 1)
		return implementsClause;
	}

	/**
	 * Gets the constructor of the provided Class
	 * @param {Class} classDeclaration
	 * @returns {ConstructorDeclaration}
	 */
	public getConstructor (classDeclaration: Class): ConstructorDeclaration|undefined {
		return <ConstructorDeclaration|undefined> classDeclaration.members.find(member => isConstructorDeclaration(member));
	}

	/**
	 * Gets the member of the class with the provided name. In case there are multiple (such as will
	 * be the case with getters and setters, the first matched one will be returned).
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {ClassElement}
	 */
	public getMemberWithName (name: string, classDeclaration: Class): ClassElement|undefined {
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
	 * @param {Class} classDeclaration
	 * @returns {ClassElement}
	 */
	public getStaticMemberWithName (name: string, classDeclaration: Class): ClassElement|undefined {
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
	 * @param {Class} classDeclaration
	 * @returns {MethodDeclaration}
	 */
	public getMethodWithName (name: string, classDeclaration: Class): MethodDeclaration|undefined {
		return <MethodDeclaration|undefined> classDeclaration.members.find(member => isMethodDeclaration(member) && this.matchesMemberName(name, member));
	}

	/**
	 * Gets the PropertyDeclaration from the provided ClassDeclaration or ClassExpression that matches the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {PropertyDeclaration}
	 */
	public getPropertyWithName (name: string, classDeclaration: Class): PropertyDeclaration|undefined {
		return <PropertyDeclaration|undefined> classDeclaration.members.find(member => isPropertyDeclaration(member) && this.matchesMemberName(name, member));
	}

	/**
	 * Gets the (static) MethodDeclaration from the provided ClassDeclaration or ClassExpression that matches the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {MethodDeclaration}
	 */
	public getStaticMethodWithName (name: string, classDeclaration: Class): MethodDeclaration|undefined {
		return <MethodDeclaration|undefined> classDeclaration.members.find(member => isMethodDeclaration(member) && this.matchesStaticMemberName(name, member));
	}

	/**
	 * Gets the (static) PropertyDeclaration from the provided ClassDeclaration or ClassExpression that matches the provided name
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {PropertyDeclaration}
	 */
	public getStaticPropertyWithName (name: string, classDeclaration: Class): PropertyDeclaration|undefined {
		return <PropertyDeclaration|undefined> classDeclaration.members.find(member => isPropertyDeclaration(member) && this.matchesStaticMemberName(name, member));
	}

	/**
	 * Returns true if the class doesn't extend any other class
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public isBaseClass (classDeclaration: Class): boolean {
		return this.getExtendedClass(classDeclaration) == null;
	}

	/**
	 * Returns true if the provided class extends a class with the provided name
	 * @param {string} name
	 * @param {ts.Class} classDeclaration
	 * @returns {boolean}
	 */
	public isExtendingClassWithName (name: string, classDeclaration: Class): boolean {
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
	 * @param {ts.Class} classDeclaration
	 * @returns {boolean}
	 */
	public isImplementingInterfaceWithName (name: string, classDeclaration: Class): boolean {
		const implementedInterfaces = this.getImplements(classDeclaration);
		if (implementedInterfaces == null) return false;

		// It does if any of the implemented interfaces is an identifier with a name equal to the provided one
		return implementedInterfaces.types.some(implementedInterface => isIdentifier(implementedInterface.expression) && implementedInterface.expression.text === name);
	}

	/**
	 * Returns true if the provided class has a constructor
	 * @param {ts.Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasConstructor (classDeclaration: Class): boolean {
		return this.getConstructor(classDeclaration) != null;
	}

	/**
	 * Returns true if the provided class has a member with a name equal to the provided one
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasMemberWithName (name: string, classDeclaration: Class): boolean {
		return this.getMemberWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the provided class has a static member with a name equal to the provided one
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasStaticMemberWithName (name: string, classDeclaration: Class): boolean {
		return this.getStaticMemberWithName(name, classDeclaration) != null;
	}

	/**
	 * Returns true if the provided class has a getter with a name equal to the provided one
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasGetterWithName (name: string, classDeclaration: Class): boolean {
		return classDeclaration.members.find(member => isGetAccessorDeclaration(member) && (isIdentifier(member.name) || isStringLiteral(member.name)) && member.name.text === name) != null;
	}

	/**
	 * Returns true if the provided class has a setter with a name equal to the provided one
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {boolean}
	 */
	public hasSetterWithName (name: string, classDeclaration: Class): boolean {
		return classDeclaration.members.find(member => isSetAccessorDeclaration(member) && (isIdentifier(member.name) || isStringLiteral(member.name)) && member.name.text === name) != null;
	}

	/**
	 * Appends one or more instructions to the getter on the class that matches the provided name
	 * @param {string} getterName
	 * @param {string} instructions
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public appendInstructionsToGetter (getterName: string, instructions: string, classDeclaration: Class): Class {
		const getter = this.getGetterWithName(getterName, classDeclaration);
		if (getter == null) {
			throw new ReferenceError(`${this.constructor.name} could not find a getter with the name: ${getterName}`);
		}

		// Append the instructions
		this.getAccessorService.appendInstructions(instructions, getter);

		// Return the original ClassDeclaration
		return classDeclaration;
	}

	/**
	 * Appends one or more instructions to the setter on the class that matches the provided name
	 * @param {string} setterName
	 * @param {string} instructions
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public appendInstructionsToSetter (setterName: string, instructions: string, classDeclaration: Class): Class {
		const setter = this.getSetterWithName(setterName, classDeclaration);
		if (setter == null) {
			throw new ReferenceError(`${this.constructor.name} could not find a setter with the name: ${setterName}`);
		}

		// Append the instructions
		this.setAccessorService.appendInstructions(instructions, setter);

		// Return the original ClassDeclaration
		return classDeclaration;
	}

	/**
	 * Appends one or more instructions to the method on the class that matches the provided name
	 * @param {string} methodName
	 * @param {string} instructions
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public appendInstructionsToMethod (methodName: string, instructions: string, classDeclaration: Class): Class {
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
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public appendInstructionsToStaticMethod (methodName: string, instructions: string, classDeclaration: Class): Class {
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
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public appendInstructionsToConstructor (instructions: string, classDeclaration: Class): Class {
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
	 * @param {IClassCtor} options
	 * @returns {ClassDeclaration}
	 */
	public createClassDeclaration (options: IClassCtor): ClassDeclaration {
		return this.formatter.formatClassDeclaration(options);
	}

	/**
	 * Creates a ClassDeclaration and adds it to the provided SourceFile
	 * @param {IClassCtor} options
	 * @param {SourceFile} sourceFile
	 * @param {IPlacement} [placement]
	 * @returns {ClassDeclaration}
	 */
	public createAndAddClassDeclarationToSourceFile (options: IClassCtor, sourceFile: SourceFile, placement: IPlacement = {position: "AFTER"}): ClassDeclaration {
		const classDeclaration = this.createClassDeclaration(options);

		// Update the SourceFile to reflect the change
		this.updater.updateSourceFileStatements(
			this.joiner.joinStatementNodeArrays(createNodeArray([classDeclaration]), sourceFile.statements, placement),
			sourceFile
		);

		return classDeclaration;
	}

	/**
	 * Sets the name of a given Class
	 * @param {string} name
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public setNameOfClass (name: string, classDeclaration: Class): Class {
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
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public extendClassWith (name: INameWithTypeArguments, classDeclaration: Class): Class {
		// If the class already extends something matching the provided name, return the existing class declaration
		if (this.isExtendingClassWithName(name.name, classDeclaration)) return classDeclaration;

		// Get the existing implements clause
		const existing = this.getImplements(classDeclaration);

		return this.updater.updateClassDeclarationHeritageClauses(
			this.joiner.joinHeritageClauses(
				this.formatter.formatExtendsHeritageClause({...name, kind: "EXTENDS"}),
				existing
			),
			classDeclaration
		);
	}

	/**
	 * Implements an interface with the provided INameWithTypeArguments on the provided class
	 * @param {INameWithTypeArguments} name
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public implementInterfaceOnClass (name: INameWithTypeArguments, classDeclaration: Class): Class {
		// If the class already implements something matching the provided name, return the existing class declaration
		if (this.isImplementingInterfaceWithName(name.name, classDeclaration)) return classDeclaration;

		// Generate a new HeritageClause
		const newClause = this.formatter.formatImplementsHeritageClause({kind: "IMPLEMENTS", elements: [name]});

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
	 * @param {IClassPropertyCtor} property
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public addPropertyToClass (property: IClassPropertyCtor, classDeclaration: Class): Class {
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
	 * @param {IConstructorCtor} constructor
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public addConstructorToClass (constructor: IConstructorCtor, classDeclaration: Class): Class {
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
	 * @param {IClassMethodCtor} method
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public addMethodToClass (method: IClassMethodCtor, classDeclaration: Class): Class {
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
	 * @param {IClassSetAccessorCtor} method
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public addSetterToClass (method: IClassSetAccessorCtor, classDeclaration: Class): Class {
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
	 * @param {IClassGetAccessorCtor} method
	 * @param {Class} classDeclaration
	 * @returns {Class}
	 */
	public addGetterToClass (method: IClassGetAccessorCtor, classDeclaration: Class): Class {
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
	 * Maps the provided class to an IClassDict
	 * @param {Class} node
	 * @returns {IClassDict}
	 */
	public toLightAST (node: Class): IClassDict {
		return this.nodeToDictMapper.toIClassDict(node)!;
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