import {IFormatter} from "./i-formatter";
import {ParameterDict} from "../dict/parameter/parameter-dict";
import {AccessorDeclaration, BindingName, Block, ClassDeclaration, ClassElement, ClassExpression, ConstructorDeclaration, createArrayBindingPattern, createBindingElement, createClassDeclaration, createConstructor, createDecorator, createExpressionWithTypeArguments, createGetAccessor, createHeritageClause, createIdentifier, createImportClause, createImportDeclaration, createImportSpecifier, createLiteral, createMethod, createNamedImports, createNamespaceImport, createNodeArray, createObjectBindingPattern, createOmittedExpression, createParameter, createProperty, createSetAccessor, createToken, Decorator, Expression, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportDeclaration, isClassExpression, MethodDeclaration, Modifier, NamedImports, NamespaceImport, NodeArray, ParameterDeclaration, PropertyDeclaration, SetAccessorDeclaration, SyntaxKind, Token, TypeNode, TypeParameterDeclaration, updateClassDeclaration, updateClassExpression} from "typescript";
import {DecoratorDict} from "../dict/decorator/decorator-dict";
import {DecoratorKind} from "../dict/decorator/decorator-kind";
import {IParseService} from "../service/parse/i-parse-service";
import {ArrayBindingElementKind} from "../dict/binding-element/array-binding-element-kind";
import {BindingNameDict} from "../dict/binding-name/binding-name-dict";
import {BindingNameKind} from "../dict/binding-name/binding-name-kind";
import {IImportDict} from "../dict/import/i-import-dict";
import {AccessorDict, IGetAccessorDict, ISetAccessorDict} from "../dict/accessor/accessor-dict";
import {AccessorKind} from "../dict/accessor/accessor-kind";
import {IAllModifiersDict} from "../dict/modifier/i-all-modifiers-dict";
import {ModifierKind} from "../dict/modifier/modifier-kind";
import {ClassAccessorDict, IClassGetAccessorDict, IClassSetAccessorDict} from "../dict/class-accessor/class-accessor-dict";
import {IMethodDict} from "../dict/method/i-method-dict";
import {IClassMethodDict} from "../dict/class-method/i-class-method-dict";
import {IClassPropertyDict} from "../dict/class-property/i-class-property-dict";
import {IConstructorDict} from "../dict/constructor/i-constructor-dict";
import {IClassDict} from "../dict/class/i-class-dict";
import {INameWithTypeArguments} from "../dict/name-with-type-arguments/i-name-with-type-arguments";
import {ClassElementDict} from "../dict/class-element/class-element-dict";
import {isClassAccessorDict} from "../dict/class-accessor/is-class-accessor-dict";
import {isIClassPropertyDict} from "../dict/class-property/is-i-class-property-dict";
import {isIClassMethodDict} from "../dict/class-method/is-i-class-method-dict";
import {isINameWithTypeArguments} from "../dict/name-with-type-arguments/is-i-name-with-type-arguments";
import {isIConstructorDict} from "../dict/constructor/is-i-constructor-dict";
import {isIImportDict} from "../dict/import/is-import-dict";
import {isAccessorDict} from "../dict/accessor/is-accessor-dict";
import {isIGetAccessorDict} from "../dict/accessor/is-i-get-accessor-dict";
import {isISetAccessorDict} from "../dict/accessor/is-i-set-accessor-dict";
import {isIClassGetAccessorDict} from "../dict/class-accessor/is-i-class-get-accessor-dict";
import {isIClassSetAccessorDict} from "../dict/class-accessor/is-i-class-set-accessor-dict";
import {isIMethodDict} from "../dict/method/is-i-method-dict";
import {isClassElementDict} from "../dict/class-element/is-class-element-dict";
import {isIClassDict} from "../dict/class/is-i-class-dict";
import {isBindingNameDict} from "../dict/binding-name/is-binding-name-dict";
import {isParameterDict} from "../dict/parameter/is-parameter-dict";
import {isDecoratorDict} from "../dict/decorator/is-decorator-dict";
import {INodeUpdaterUtil} from "../../util/node-updater-util/i-node-updater-util";

export class Formatter implements IFormatter {

	constructor (private parseService: IParseService,
							 private nodeUpdaterUtil: INodeUpdaterUtil) {
	}

	/**
	 * Formats a ClassElement
	 * @param {ClassElementDict|ClassElement} member
	 * @returns {ClassElement}
	 */
	public formatClassElement (member: ClassElementDict|ClassElement): ClassElement {
		// It may be a proper ClassElement already
		if (!isClassElementDict(member)) {
			return member;
		}

		if (isClassAccessorDict(member)) {
			return this.formatClassAccessor(member);
		}

		else if (isIClassPropertyDict(member)) {
			return this.formatClassProperty(member);
		}

		else if (isIClassMethodDict(member)) {
			return this.formatClassMethod(member);
		}

		else {
			return this.formatConstructor(member);
		}
	}

	/**
	 * Formats an Iterable of ClassElementDicts
	 * @param {Iterable<ClassElementDict|ClassElement>} members
	 * @param {NodeArray<ClassElement>?} [existing]
	 * @returns {NodeArray<ClassElement>}
	 */
	public formatClassElements (members: Iterable<ClassElementDict|ClassElement>, existing?: NodeArray<ClassElement>|undefined): NodeArray<ClassElement> {
		const existingMembers = existing == null ? [] : [...existing];

		return createNodeArray([...members, ...existingMembers].map(element => this.formatClassElement(element)));
	}

	/**
	 * Formats the provided 'extend' and 'implement' options into a NodeArray of HeritageClauses.
	 * @param {INameWithTypeArguments|HeritageClause|null|?} extend
	 * @param {INameWithTypeArguments | Iterable<INameWithTypeArguments>|HeritageClause|null|?} implement
	 * @param {NodeArray<HeritageClause>} [existing]
	 * @returns {NodeArray<HeritageClause>}
	 */
	public formatHeritageClauses (extend: INameWithTypeArguments|undefined|null|HeritageClause, implement: INameWithTypeArguments|Iterable<INameWithTypeArguments>|HeritageClause|undefined|null, existing?: NodeArray<HeritageClause>): NodeArray<HeritageClause> {
		// Find any existing 'extends' heritage clause, if it exists and is given as an argument
		const existingExtends = existing == null ? undefined : existing.find(clause => clause.token === SyntaxKind.ExtendsKeyword);

		// Find any existing 'implements' heritage clause, if it exists and is given as an argument
		const existingImplements = existing == null ? undefined : existing.find(clause => clause.token === SyntaxKind.ImplementsKeyword);

		const extendsClause = extend == null ? existingExtends == null ? [] : [existingExtends] : [isINameWithTypeArguments(extend) || this.isIterable(implement) ? this.formatExtendsHeritageClause(extend) : extend];
		const implementsClause = implement == null ? existingImplements == null ? [] : [existingImplements] : [isINameWithTypeArguments(implement) || this.isIterable(implement) ? this.formatImplementsHeritageClause(implement) : implement];
		return createNodeArray([...extendsClause, ...implementsClause]);
	}

	/**
	 * Creates a Heritage Clause for an extends relation
	 * @param {INameWithTypeArguments|HeritageClause} extend
	 * @returns {HeritageClause}
	 */
	public formatExtendsHeritageClause (extend: INameWithTypeArguments|HeritageClause): HeritageClause {
		// Return the existing HeritageClause if called with such a thing
		if (!isINameWithTypeArguments(extend)) {
			return extend;
		}

		const {name, typeArguments} = extend;

		// Generate an identifier for the extended class
		const identifier = createIdentifier(name);

		// Wrap it inside an expression with type arguments
		const expression = createExpressionWithTypeArguments(
			typeArguments == null ? createNodeArray() : this.formatTypes(typeArguments),
			identifier
		);

		// Assign undefined to the typeArguments if they are not defined
		if (expression.typeArguments != null && expression.typeArguments.length === 0) {
			expression.typeArguments = undefined;
		}

		return createHeritageClause(SyntaxKind.ExtendsKeyword, createNodeArray([expression]));
	}

	/**
	 * Formats the provided implements heritage clause
	 * @param {INameWithTypeArguments | Iterable<INameWithTypeArguments>|HeritageClause} implement
	 * @returns {ts.HeritageClause}
	 */
	public formatImplementsHeritageClause (implement: INameWithTypeArguments|Iterable<INameWithTypeArguments>|HeritageClause): HeritageClause {
		// Return the existing HeritageClause if called with such a thing
		if (!isINameWithTypeArguments(implement) && !this.isIterable(implement)) {
			return implement;
		}

		const normalized = this.isIterable(implement) ? [...implement] : [implement];
		const elements = normalized.map(element => {
			// Generate an identifier for the extended class
			const identifier = createIdentifier(element.name);

			// Wrap it inside an expression with type arguments
			const expression = createExpressionWithTypeArguments(
				element.typeArguments == null ? createNodeArray() : this.formatTypes(element.typeArguments),
				identifier
			);

			// Assign undefined to the typeArguments if they are not defined
			if (expression.typeArguments != null && expression.typeArguments.length === 0) {
				expression.typeArguments = undefined;
			}

			return expression;
		});

		return createHeritageClause(SyntaxKind.ImplementsKeyword, createNodeArray(elements));
	}

	/**
	 * Formats a ClassDeclaration|ClassExpression
	 * @param {IClassDict | ClassDeclaration|ClassExpression} options
	 * @returns {ts.ClassDeclaration|ClassExpression}
	 */
	public formatClass (options: IClassDict|ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// It may be a ClassDeclaration|ClassExpression already
		if (!isIClassDict(options)) {
			return options;
		}

		// Unpack
		const {isAbstract, implementsInterfaces, decorators, name, extendsClass, members, typeParameters} = options;

		return createClassDeclaration(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAbstract}),
			name == null ? undefined : name,
			typeParameters == null ? undefined : this.formatTypeParameters(typeParameters),
			this.formatHeritageClauses(extendsClass, implementsInterfaces),
			members == null ? createNodeArray() : this.formatClassElements(members)
		);
	}

	/**
	 * Updates a ClassDeclaration|ClassExpression
	 * @param {Iterable<DecoratorDict> | null} decorators
	 * @param {string | null} name
	 * @param {Iterable<string> | null} typeParameters
	 * @param {Iterable<ClassElementDict> | null} members
	 * @param {boolean} isAbstract
	 * @param {INameWithTypeArguments | null} extendsClass
	 * @param {Iterable<INameWithTypeArguments> | null} implementsInterfaces
	 * @param {ClassDeclaration|ClassExpression} existing
	 * @param {boolean} merge
	 * @returns {ClassDeclaration|ClassExpression}
	 */
	public updateClass ({decorators, name, typeParameters, members, isAbstract, extendsClass, implementsInterfaces}: Partial<IClassDict>, existing: ClassDeclaration|ClassExpression): ClassDeclaration|ClassExpression {
		// If we're having to do with an expression
		if (isClassExpression(existing)) {
			const classExpressionUpdated = updateClassExpression(
				existing,
				isAbstract == null ? existing.modifiers : this.formatModifiers({isAbstract}),
				name == null ? existing.name : typeof name === "string" ? createIdentifier(name) : name,
				typeParameters == null ? existing.typeParameters : this.formatTypeParameters(typeParameters),
				this.formatHeritageClauses(extendsClass, implementsInterfaces, existing.heritageClauses),
				members == null ? existing.members : this.formatClassElements(members, existing.members));

			// Force-set heritageClauses to undefined if they have none
			if (classExpressionUpdated.heritageClauses!.length === 0) classExpressionUpdated.heritageClauses = undefined;
			return this.nodeUpdaterUtil.updateInPlace(classExpressionUpdated, existing);
		}

		// If we're having to do with a declaration
		const updated = updateClassDeclaration(
			existing,
			decorators == null ? existing.decorators : this.formatDecorators(decorators),
			isAbstract == null ? existing.modifiers : this.formatModifiers({isAbstract}),
			name == null ? existing.name : typeof name === "string" ? createIdentifier(name) : name,
			typeParameters == null ? existing.typeParameters : this.formatTypeParameters(typeParameters),
			this.formatHeritageClauses(extendsClass, implementsInterfaces, existing.heritageClauses),
			members == null ? existing.members : this.formatClassElements(members, existing.members));

		// Force-set heritageClauses to undefined if they have none
		if (updated.heritageClauses!.length === 0) updated.heritageClauses = undefined;

		return this.nodeUpdaterUtil.updateInPlace(updated, existing);
	}

	/**
	 * Creates a ConstructorDeclaration from the provided options
	 * @param {IConstructorDict | ts.ConstructorDeclaration} options
	 * @returns {ts.ConstructorDeclaration}
	 */
	public formatConstructor (options: IConstructorDict|ConstructorDeclaration): ConstructorDeclaration {
		if (!isIConstructorDict(options)) {
			return options;
		}

		// Unpack
		const {body, parameters} = options;
		return createConstructor(
			undefined,
			undefined,
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Creates a PropertyDeclaration from the provided options
	 * @param {IClassPropertyDict | ts.PropertyDeclaration} options
	 * @returns {ts.PropertyDeclaration}
	 */
	public formatClassProperty (options: IClassPropertyDict|PropertyDeclaration): PropertyDeclaration {
		// It may already be a PropertyDeclaration
		if (!isIClassPropertyDict(options)) {
			return options;
		}

		// Unpack
		const {decorators, isStatic, isOptional, isAbstract, visibility, isAsync, name, type, initializer, isReadonly} = options;

		return createProperty(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isStatic, isAbstract, visibility, isAsync, isReadonly}),
			name,
			this.formatQuestionToken(isOptional),
			this.formatType(type),
			initializer == null ? undefined : this.formatExpression(initializer)
		);
	}

	/**
	 * Creates a MethodDeclaration from the provided options
	 * @param {IMethodDict | ts.MethodDeclaration} options
	 * @returns {ts.MethodDeclaration}
	 */
	public formatMethod (options: IMethodDict|MethodDeclaration): MethodDeclaration {
		// It may be a method already
		if (!isIMethodDict(options)) {
			return options;
		}

		// Unpack it
		const {decorators, body, typeParameters, isAsync, name, parameters, type} = options;

		return createMethod(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAsync}),
			undefined,
			name,
			undefined,
			typeParameters == null ? undefined : this.formatTypeParameters(typeParameters),
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			this.formatType(type),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Formats a MethodDeclaration from the provided options
	 * @param {IClassMethodDict | MethodDeclaration} options
	 * @returns {MethodDeclaration}
	 */
	public formatClassMethod (options: IClassMethodDict|MethodDeclaration): MethodDeclaration {
		if (!isIClassMethodDict(options)) {
			return options;
		}

		// Unpack it
		const {decorators, type, parameters, name, isAsync, typeParameters, body, visibility, isStatic, isAbstract, isOptional} = options;

		return createMethod(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAsync, visibility, isStatic, isAbstract}),
			undefined,
			name,
			this.formatQuestionToken(isOptional),
			typeParameters == null ? undefined : this.formatTypeParameters(typeParameters),
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			this.formatType(type),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Formats the provided options into a GetAccessorDeclaration or a SetAccessorDeclaration
	 * @param {ClassAccessorDict} accessor
	 * @returns {GetAccessorDeclaration | SetAccessorDeclaration}
	 */
	public formatClassAccessor (accessor: ClassAccessorDict|AccessorDeclaration): GetAccessorDeclaration|SetAccessorDeclaration {
		// It may already be an AccessorDeclaration
		if (!isClassAccessorDict(accessor)) {
			return accessor;
		}

		if (accessor.kind === AccessorKind.GET) {
			return this.formatGetAccessor(accessor);
		} else {
			return this.formatSetAccessor(accessor);
		}
	}

	/**
	 * Formats a GetAccessor from the provided options
	 * @param {IClassGetAccessorDict | GetAccessorDeclaration} options
	 * @returns {GetAccessorDeclaration}
	 */
	public formatClassGetAccessor (options: IClassGetAccessorDict|GetAccessorDeclaration): GetAccessorDeclaration {
		// It may already be a GetAccessorDeclaration
		if (!isIClassGetAccessorDict(options)) {
			return options;
		}

		// Unpack it
		const {decorators, isAsync, isStatic, isAbstract, visibility, name, type, body} = options;

		return createGetAccessor(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAsync, isStatic, isAbstract, visibility}),
			name,
			createNodeArray(),
			this.formatType(type),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Formats the provided options into a SetAccessorDeclaration
	 * @param {IClassSetAccessorDict | ts.SetAccessorDeclaration} options
	 * @returns {ts.SetAccessorDeclaration}
	 */
	public formatClassSetAccessor (options: IClassSetAccessorDict|SetAccessorDeclaration): SetAccessorDeclaration {
		// It may already be a SetAccessor
		if (!isIClassSetAccessorDict(options)) {
			return options;
		}

		// Unpack it
		const {decorators, isAsync, isStatic, isAbstract, visibility, name, body, parameters} = options;
		return createSetAccessor(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAsync, isStatic, isAbstract, visibility}),
			name,
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Formats the provided options into a GetAccessorDeclaration or a SetAccessorDeclaration
	 * @param {AccessorDict|AccessorDeclaration} accessor
	 * @returns {GetAccessorDeclaration | SetAccessorDeclaration}
	 */
	public formatAccessor (accessor: AccessorDict|AccessorDeclaration): GetAccessorDeclaration|SetAccessorDeclaration {
		// If we already have a proper AccessorDeclaration, return a copy of it
		if (!isAccessorDict(accessor)) {
			return accessor;
		}

		if (isIGetAccessorDict(accessor)) {
			return this.formatGetAccessor(accessor);
		} else {
			return this.formatSetAccessor(accessor);
		}
	}

	/**
	 * Formats a GetAccessor from the provided options
	 * @param {IGetAccessorDict | GetAccessorDeclaration} options
	 * @returns {GetAccessorDeclaration}
	 */
	public formatGetAccessor (options: IGetAccessorDict|GetAccessorDeclaration): GetAccessorDeclaration {
		if (!isIGetAccessorDict(options)) {
			return options;
		}

		// Unpack it
		const {decorators, isAsync, type, body, name} = options;

		return createGetAccessor(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAsync}),
			name,
			createNodeArray(),
			this.formatType(type),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Formats the provided options into a SetAccessorDeclaration
	 * @param {ISetAccessorDict | SetAccessorDeclaration} options
	 * @returns {SetAccessorDeclaration}
	 */
	public formatSetAccessor (options: ISetAccessorDict|SetAccessorDeclaration): SetAccessorDeclaration {
		if (!isISetAccessorDict(options)) {
			return options;
		}

		// Unpack it
		const {decorators, isAsync, name, body, parameters} = options;

		return createSetAccessor(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAsync}),
			name,
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Updates an import declaration with the provided properties
	 * @param {string} path
	 * @param {string?} defaultName
	 * @param {Iterable<string>?} namedImports
	 * @param {string?} namespace
	 * @param {ImportDeclaration} existing
	 * @returns {ImportDeclaration}
	 */
	public updateImportDeclaration ({path, defaultName, namedImports, namespace}: Partial<IImportDict>, existing: ImportDeclaration): ImportDeclaration {
		// Update the path if it is given in the dict. It may be a StringLiteral already
		const newPath = path == null ? existing.moduleSpecifier : typeof path === "string" ? createLiteral(path) : path;

		// Check if new named bindings exist
		const hasNewNamedBindings = namedImports != null || namespace != null;

		let importClause: ImportClause|undefined;

		// If neither new named imports, a new namespace import or a new default name is given, just use the existing import clause
		if (!hasNewNamedBindings && defaultName == null) {
			importClause = existing.importClause;
		}

		// Something new to the import clause is given
		else {
			let newDefaultName: string|undefined|null|Identifier;

			// If there is no import clause or the import clause doesn't have a default name, assign the new default name to it.
			// It may be undefined, which is fine
			if (existing.importClause == null || existing.importClause.name == null) {
				newDefaultName = defaultName;
			}

			// If there is a default import already, use it unless a new one is provided
			else if (existing.importClause != null && existing.importClause.name != null) {
				newDefaultName = defaultName == null ? existing.importClause.name.text : defaultName;
			}

			// Update the default name if it is given in the dict. It may already be an Identifier
			const defaultNameIdentifier = defaultName == null ? undefined : typeof defaultName === "string" ? createIdentifier(defaultName) : defaultName;

			if (!hasNewNamedBindings) {

				// Use the new name and the existing named bindings
				importClause = createImportClause(defaultNameIdentifier, existing.importClause == null ? undefined : existing.importClause.namedBindings);
			}

			// Use the new name and the new named bindings
			else {
				// If a new namespace is given, use the new default name and the new namespace
				if (namespace != null) {
					importClause = createImportClause(defaultNameIdentifier, this.formatNamespaceImport(namespace));
				}
				// If new named imports is given, merge with the existing ones and the default name
				else if (namedImports != null) {

					// Generate a new import clause from them
					importClause = createImportClause(defaultNameIdentifier, this.formatNamedImports(namedImports));
				}
			}
		}

		// Return the updated import declaration
		return this.nodeUpdaterUtil.updateInPlace(createImportDeclaration(
			existing.decorators,
			existing.modifiers,
			importClause,
			newPath
		), existing);
	}

	/**
	 * Creates a new ImportDeclaration
	 * @param {IImportDict | ImportDeclaration} importDeclaration
	 * @returns {ImportDeclaration}
	 */
	public formatImportDeclaration (importDeclaration: IImportDict|ImportDeclaration): ImportDeclaration {
		// If the provided item is already an ImportDeclaration, return it
		if (!isIImportDict(importDeclaration)) {
			return importDeclaration;
		}

		// Unpack it
		const {path, namedImports, namespace, defaultName} = importDeclaration;

		// Create an identifier for the default name. The default name may already be an identifier
		const nameIdentifier = defaultName == null ? undefined : typeof defaultName === "string" ? createIdentifier(defaultName) : defaultName;

		// Generate import specifiers for the named imports
		const namedImportImportSpecifiers = namedImports == null ? undefined : this.formatNamedImports(namedImports);

		// Generate a namespace import
		const namespaceImport = namespace == null ? undefined : this.formatNamespaceImport(namespace);

		const clause = createImportClause(
			nameIdentifier,
			namespaceImport != null ? namespaceImport : namedImportImportSpecifiers
		);

		return createImportDeclaration(
			undefined,
			undefined,
			clause,
			// The path may already be a StringLiteral
			typeof path === "string" ? createLiteral(path) : path
		);
	}

	/**
	 * Creates NamedImports from all of the provided named import names
	 * @param {Iterable<string>|string|NamedImports} namedImports
	 * @returns {NamedImports}
	 */
	public formatNamedImports (namedImports: string|Iterable<string>|NamedImports): NamedImports {
		if (typeof namedImports === "string") {
			// Create an identifier for the named import
			const namedImportIdentifier = createIdentifier(namedImports);

			// Create a NamedImport for it
			return createNamedImports(createNodeArray([createImportSpecifier(namedImportIdentifier, namedImportIdentifier)]));

		}

		// The input is already a NamedImports.
		else if (!this.isIterable(namedImports)) {
			return namedImports;
		}

		else {
			// Create identifiers for all of the named imports
			const importIdentifiers = [...namedImports].map(namedImport => createIdentifier(namedImport));
			const importSpecifiers = importIdentifiers.map(identifier => createImportSpecifier(identifier, identifier));

			// Create NamedImports for them
			return createNamedImports(createNodeArray(importSpecifiers));
		}
	}

	/**
	 * Creates a NamespaceImport with the provided name
	 * @param {string|NamespaceImport} namespaceName
	 * @returns {NamespaceImport}
	 */
	public formatNamespaceImport (namespaceName: string|NamespaceImport): NamespaceImport {
		// The input is already a NamespaceImport
		if (typeof namespaceName !== "string") {
			return namespaceName;
		}
		// Create an identifier for the namespace import
		const namedImportIdentifier = createIdentifier(namespaceName);

		// Create a namespace import for it
		return createNamespaceImport(namedImportIdentifier);
	}

	/**
	 * Creates a Modifier from the provided string
	 * @param {ModifierKind} modifier
	 * @returns {Modifier}
	 */
	public formatModifier (modifier: ModifierKind): Modifier {
		switch (modifier) {
			case "const":
				return createToken(SyntaxKind.ConstKeyword);
			case "declare":
				return createToken(SyntaxKind.DeclareKeyword);
			case "default":
				return createToken(SyntaxKind.DefaultKeyword);
			case "export":
				return createToken(SyntaxKind.ExportKeyword);
			case "readonly":
				return createToken(SyntaxKind.ReadonlyKeyword);
			case "private":
				return createToken(SyntaxKind.PrivateKeyword);
			case "protected":
				return createToken(SyntaxKind.ProtectedKeyword);
			case "public":
				return createToken(SyntaxKind.PublicKeyword);
			case "async":
				return createToken(SyntaxKind.AsyncKeyword);
			case "static":
				return createToken(SyntaxKind.StaticKeyword);
			case "abstract":
				return createToken(SyntaxKind.AbstractKeyword);
		}

		throw new TypeError(`${this.constructor.name} could not generate a modifier for the provided string: ${modifier}`);
	}

	/**
	 * Formats all of the provided modifiers and returns a NodeArray of Modifiers
	 * @param {boolean} isAbstract
	 * @param {boolean} isAsync
	 * @param {boolean} isStatic
	 * @param {boolean} isReadonly
	 * @param {boolean} isConst
	 * @param {boolean} isExported
	 * @param {boolean} isDeclared
	 * @param {boolean} isDefault
	 * @param {VisibilityKind} visibility
	 * @returns {NodeArray<Modifier>}
	 */
	public formatModifiers ({isAbstract, isAsync, isStatic, isReadonly, isConst, isExported, isDeclared, isDefault, visibility}: Partial<IAllModifiersDict>): NodeArray<Modifier> {
		const abstractModifier = isAbstract == null || !isAbstract ? [] : [this.formatModifier("abstract")];
		const asyncModifier = isAsync == null || !isAsync ? [] : [this.formatModifier("async")];
		const staticModifier = isStatic == null || !isStatic ? [] : [this.formatModifier("static")];
		const readonlyModifier = isReadonly == null || !isReadonly ? [] : [this.formatModifier("readonly")];
		const constModifier = isConst == null || !isConst ? [] : [this.formatModifier("const")];
		const exportModifier = isExported == null || !isExported ? [] : [this.formatModifier("export")];
		const declareModifier = isDeclared == null || !isDeclared ? [] : [this.formatModifier("declare")];
		const defaultModifier = isDefault == null || !isDefault ? [] : [this.formatModifier("default")];
		const visibilityModifier = visibility == null ? [] : [this.formatModifier(visibility)];

		return createNodeArray([
				...abstractModifier,
				...asyncModifier,
				...staticModifier,
				...readonlyModifier,
				...constModifier,
				...exportModifier,
				...declareModifier,
				...defaultModifier,
				...visibilityModifier
			]
		);
	}

	/**
	 * Formats an expression
	 * @param {string} expression
	 * @returns {ts.Expression}
	 */
	public formatExpression (expression: string): Expression {
		return this.parseService.parseOne<Expression>(expression);
	}

	/**
	 * Formats a DotDotDotToken
	 * @param {boolean} isRestSpread
	 * @returns {Token<SyntaxKind.DotDotDotToken>}
	 */
	public formatDotDotDotToken (isRestSpread: boolean): Token<SyntaxKind.DotDotDotToken>|undefined {
		return isRestSpread ? createToken(SyntaxKind.DotDotDotToken) : undefined;
	}

	/**
	 * Formats a QuestionToken
	 * @param {boolean} isOptional
	 * @returns {Token<SyntaxKind.QuestionToken>}
	 */
	public formatQuestionToken (isOptional: boolean): Token<SyntaxKind.QuestionToken>|undefined {
		return isOptional ? createToken(SyntaxKind.QuestionToken) : undefined;
	}

	/**
	 * Generates a Decorator from the provided options
	 * @param {DecoratorDict|Decorator} decorator
	 * @returns {Decorator}
	 */
	public formatDecorator (decorator: DecoratorDict|Decorator): Decorator {
		// It may be a Decorator already
		if (!isDecoratorDict(decorator)) {
			return decorator;
		}

		if (decorator.kind === DecoratorKind.IDENTIFIER) {
			// Creates a decorator with the provided name as identifier
			return createDecorator(createIdentifier(decorator.name));
		}

		else {
			const firstExpression = this.parseService.parseOne<Expression>(decorator.expression);
			return createDecorator(firstExpression);
		}
	}

	/**
	 * Formats all of the provided DecoratorDicts into a NodeArray of Decorators
	 * @param {Iterable<DecoratorDict|Decorator>} decorators
	 * @returns {NodeArray<Decorator>}
	 */
	public formatDecorators (decorators: Iterable<DecoratorDict|Decorator>): NodeArray<Decorator> {
		return createNodeArray([...decorators].map(decorator => this.formatDecorator(decorator)));
	}

	/**
	 * Formats a BindingName from the provided BindingNameDit
	 * @param {BindingNameDict} name
	 * @returns {BindingName}
	 */
	public formatBindingName (name: BindingNameDict|BindingName): BindingName {
		// It may already be a BindingName
		if (!isBindingNameDict(name)) {
			return name;
		}

		if (name.kind === BindingNameKind.NORMAL) {
			return createIdentifier(name.name);
		}

		else if (name.kind === BindingNameKind.ARRAY_BINDING) {
			return createArrayBindingPattern(
				createNodeArray(name.elements.map(element => element.kind === ArrayBindingElementKind.OMITTED
					? createOmittedExpression()
					: createBindingElement(
						this.formatDotDotDotToken(element.isRestSpread),
						element.name,
						element.name,
						element.initializer == null ? undefined : this.formatExpression(element.initializer)
					)))
			);
		}

		else {
			return createObjectBindingPattern(
				createNodeArray(name.elements.map(element => createBindingElement(
					this.formatDotDotDotToken(element.isRestSpread),
					element.propertyName,
					element.name,
					element.initializer == null ? undefined : this.formatExpression(element.initializer)
				)))
			);
		}
	}

	/**
	 * Generates a Parameter from the provided options
	 * @param {ParameterDict | ts.ParameterDeclaration} options
	 * @returns {ts.ParameterDeclaration}
	 */
	public formatParameter (options: ParameterDict|ParameterDeclaration): ParameterDeclaration {
		if (!isParameterDict(options)) {
			return options;
		}

		// Unpack
		const {name, decorators, isRestSpread, isOptional, type, initializer} = options;
		return createParameter(
			decorators == null ? undefined : this.formatDecorators(decorators),
			undefined,
			this.formatDotDotDotToken(isRestSpread),
			this.formatBindingName(name),
			this.formatQuestionToken(isOptional),
			this.formatType(type),
			initializer == null ? undefined : this.formatExpression(initializer)
		);
	}

	/**
	 * Formats all of the provided parameters
	 * @param {Iterable<ParameterDict|ParameterDeclaration>} parameters
	 * @returns {NodeArray<ParameterDeclaration>}
	 */
	public formatParameters (parameters: Iterable<ParameterDict|ParameterDeclaration>): NodeArray<ParameterDeclaration> {
		return createNodeArray([...parameters].map(parameter => this.formatParameter(parameter)));
	}

	/**
	 * Creates a TypeParameterDeclaration from the provided string representation of it
	 * @param {string} type
	 * @returns {TypeParameterDeclaration}
	 */
	public formatTypeParameter (type: string): TypeParameterDeclaration {
		return this.parseService.parseTypeParameterDeclaration(type);
	}

	/**
	 * Creates a NodeArray of all the TypeParameterDeclaration expressions that are provided in the given Iterable of strings
	 * @param {Iterable<string>} types
	 * @returns {NodeArray<TypeParameterDeclaration>}
	 */
	public formatTypeParameters (types: Iterable<string>): NodeArray<TypeParameterDeclaration> {
		return createNodeArray([...types].map(type => this.formatTypeParameter(type)));
	}

	/**
	 * Creates a TypeNode from the provided string representation of it
	 * @param {string} type
	 * @returns {TypeNode}
	 */
	public formatType (type: string): TypeNode {
		return this.parseService.parseType(type);
	}

	/**
	 * Creates a NodeArray of TypeNodes from the provided Iterable of string expressions
	 * @param {Iterable<string>} types
	 * @returns {NodeArray<TypeNode>}
	 */
	public formatTypes (types: Iterable<string>): NodeArray<TypeNode> {
		return createNodeArray([...types].map(type => this.formatType(type)));
	}

	/**
	 * Creates a Block from the provided string
	 * @param {string} block
	 * @returns {Block}
	 */
	public formatBlock (block: string): Block {
		return this.parseService.parseBlock(block);
	}

	/**
	 * Checks if something is an Iterable
	 * @param item
	 * @returns {boolean}
	 */
	private isIterable<T> (item: /*tslint:disable*/any/*tslint:enable*/): item is Iterable<T> {
		if (item == null) return false;
		return typeof item[Symbol.iterator] === "function";
	}

}