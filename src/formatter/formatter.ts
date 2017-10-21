import {IFormatterBase} from "./i-formatter";
import {BindingName, Block, CallExpression, ClassDeclaration, ClassElement, ConstructorDeclaration, createArrayBindingPattern, createBindingElement, createCall, createClassDeclaration, createConstructor, createDecorator, createExportSpecifier, createExpressionWithTypeArguments, createGetAccessor, createHeritageClause, createIdentifier, createImportClause, createImportDeclaration, createImportSpecifier, createKeywordTypeNode, createLiteral, createMethod, createNamedExports, createNamedImports, createNamespaceImport, createNodeArray, createObjectBindingPattern, createOmittedExpression, createParameter, createProperty, createSetAccessor, createToken, Decorator, Expression, ExpressionWithTypeArguments, GetAccessorDeclaration, HeritageClause, Identifier, ImportClause, ImportDeclaration, KeywordTypeNode, MethodDeclaration, Modifier, ModifiersArray, NamedExports, NamedImports, NamespaceImport, Node, NodeArray, ParameterDeclaration, PropertyDeclaration, SetAccessorDeclaration, Statement, StringLiteral, SyntaxKind, Token, TypeNode, TypeParameterDeclaration} from "typescript";
import {IParser} from "../parser/i-parser";
import {ClassElementCtor} from "../light-ast/ctor/class-element/class-element-ctor";
import {isClassAccessorCtor} from "../light-ast/ctor/class-accessor/is-class-accessor-ctor";
import {isIClassPropertyCtor} from "../light-ast/ctor/class-property/is-i-class-property-ctor";
import {isIClassMethodCtor} from "../light-ast/ctor/class-method/is-i-class-method-ctor";
import {HeritageCtor, IExtendsHeritageCtor, IImplementsHeritageCtor} from "../light-ast/ctor/heritage/i-heritage-ctor";
import {isIExtendsHeritageCtor} from "../light-ast/ctor/heritage/is-i-extends-heritage-ctor";
import {IClassCtor} from "../light-ast/ctor/class/i-class-ctor";
import {IConstructorCtor} from "../light-ast/ctor/constructor/i-constructor-ctor";
import {IClassPropertyCtor} from "../light-ast/ctor/class-property/i-class-property-ctor";
import {IMethodCtor} from "../light-ast/ctor/method/i-method-ctor";
import {IClassMethodCtor} from "../light-ast/ctor/class-method/i-class-method-ctor";
import {ClassAccessorCtor, IClassGetAccessorCtor, IClassSetAccessorCtor} from "../light-ast/ctor/class-accessor/class-accessor-ctor";
import {AccessorCtor, IGetAccessorCtor, ISetAccessorCtor} from "../light-ast/ctor/accessor/accessor-ctor";
import {IImportClauseCtor} from "../light-ast/ctor/import-clause/i-import-clause-ctor";
import {IImportCtor} from "../light-ast/ctor/import/i-import-ctor";
import {INamedImportExportCtor} from "../light-ast/ctor/named-import-export/i-named-import-export-ctor";
import {isINamedImportExportCtor} from "../light-ast/ctor/named-import-export/is-i-named-import-export-ctor";
import {IParameterCtor} from "../light-ast/ctor/parameter/i-parameter-ctor";
import {BindingNameCtor} from "../light-ast/ctor/binding-name/binding-name-ctor";
import {IDecoratorCtor} from "../light-ast/ctor/decorator/i-decorator-ctor";
import {IAllModifiersCtor} from "../light-ast/ctor/modifier/i-all-modifiers-ctor";
import {INameWithTypeArguments} from "../light-ast/dict/name-with-type-arguments/i-name-with-type-arguments";
import {isIGetAccessorCtor} from "../light-ast/ctor/accessor/is-i-get-accessor-ctor";
import {ModifierKind} from "../light-ast/dict/modifier/modifier-kind";
import {ICallExpressionCtor} from "../light-ast/ctor/call-expression/i-call-expression-ctor";

/**
 * A class that helps with transforming simple ctor-objects into Typescript Nodes
 */
export class Formatter implements IFormatterBase {
	constructor (private parseService: IParser) {
	}

	/**
	 * Formats a CallExpression from the provided ICallExpressionCtor
	 * @param {ICallExpressionCtor} callExpression
	 * @returns {ts.CallExpression}
	 */
	public formatCallExpression (callExpression: ICallExpressionCtor): CallExpression {
		return createCall(
			this.formatExpression(callExpression.expression),
			callExpression.typeArguments == null ? undefined : this.formatTypes(callExpression.typeArguments),
			callExpression.arguments == null ? createNodeArray() : [...callExpression.arguments].map(argument => this.formatExpression(argument))
		);
	}

	/**
	 * Formats a NodeArray from the provided Iterable
	 * @param {Iterable<T extends Node>?} nodes
	 * @returns {NodeArray<T extends Node>}
	 */
	public formatNodeArray<T extends Node> (nodes?: Iterable<T>|undefined): NodeArray<T> {
		return createNodeArray(nodes == null ? undefined : [...nodes]);
	}

	/**
	 * Formats an 'undefined' KeywordTypeNode
	 * @returns {KeywordTypeNode}
	 */
	public formatUndefined (): KeywordTypeNode {
		return createKeywordTypeNode(SyntaxKind.UndefinedKeyword);
	}

	/**
	 * Formats a ClassElement
	 * @param {ClassElementCtor} member
	 * @returns {ClassElement}
	 */
	public formatClassElement (member: ClassElementCtor): ClassElement {

		if (isClassAccessorCtor(member)) {
			return this.formatClassAccessor(member);
		}

		else if (isIClassPropertyCtor(member)) {
			return this.formatClassProperty(member);
		}

		else if (isIClassMethodCtor(member)) {
			return this.formatClassMethod(member);
		}

		else {
			return this.formatConstructor(member);
		}
	}

	/**
	 * Formats an Iterable of ClassElementCtors
	 * @param {Iterable<ClassElementCtor>} members
	 * @returns {NodeArray<ClassElement>}
	 */
	public formatClassElements (members: Iterable<ClassElementCtor>): NodeArray<ClassElement> {
		return createNodeArray([...members].map(element => this.formatClassElement(element)));
	}

	/**
	 * Formats the provided HeritageClause
	 * @param {HeritageCtor} clause
	 * @returns {HeritageClause}
	 */
	public formatHeritageClause (clause: HeritageCtor): HeritageClause {
		return isIExtendsHeritageCtor(clause) ? this.formatExtendsHeritageClause(clause) : this.formatImplementsHeritageClause(clause);
	}

	/**
	 * Formats all of the provided HeritageClauses
	 * @param {Iterable<HeritageCtor>} clauses
	 * @returns {NodeArray<HeritageClause>}
	 */
	public formatHeritageClauses (clauses: Iterable<HeritageCtor>): NodeArray<HeritageClause> {
		return createNodeArray([...clauses].map(clause => this.formatHeritageClause(clause)));
	}

	/**
	 * Formats an ExpressionWithTypeArguments
	 * @param {string} name
	 * @param {Iterable<string>} typeArguments
	 * @returns {ExpressionWithTypeArguments}
	 */
	public formatExpressionWithTypeArguments ({name, typeArguments}: INameWithTypeArguments): ExpressionWithTypeArguments {
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
		return expression;
	}

	/**
	 * Creates a Heritage Clause for an extends relation
	 * @param {INameWithTypeArguments} extend
	 * @returns {HeritageClause}
	 */
	public formatExtendsHeritageClause ({name, typeArguments}: IExtendsHeritageCtor): HeritageClause {
		return createHeritageClause(
			SyntaxKind.ExtendsKeyword,
			createNodeArray([this.formatExpressionWithTypeArguments({name, typeArguments})])
		);
	}

	/**
	 * Formats the provided 'implements' heritage clause
	 * @param {INameWithTypeArguments[]} elements
	 * @returns {HeritageClause}
	 */
	public formatImplementsHeritageClause ({elements}: IImplementsHeritageCtor): HeritageClause {
		return createHeritageClause(
			SyntaxKind.ImplementsKeyword,
			createNodeArray(elements.map(element => this.formatExpressionWithTypeArguments(element)))
		);
	}

	/**
	 * Creates an Identifier from the provided name
	 * @param {string} name
	 * @returns {Identifier}
	 */
	public formatIdentifier (name: string): Identifier {
		return createIdentifier(name);
	}

	/**
	 * Formats a ClassDeclaration
	 * @param {boolean} isAbstract
	 * @param {IImplementsHeritageCtor} implementsInterfaces
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {string} name
	 * @param {IExtendsHeritageCtor} extendsClass
	 * @param {Iterable<ClassElementCtor>} members
	 * @param {Iterable<string>} typeParameters
	 * @returns {ClassDeclaration}
	 */
	public formatClassDeclaration ({isAbstract, implementsInterfaces, decorators, name, extendsClass, members, typeParameters}: IClassCtor): ClassDeclaration {
		const classDeclaration = createClassDeclaration(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isAbstract}),
			name == null ? undefined : name,
			typeParameters == null ? undefined : this.formatTypeParameters(typeParameters),
			this.formatHeritageClauses([...(implementsInterfaces == null ? [] : [implementsInterfaces]), ...(extendsClass == null ? [] : [extendsClass])]),
			members == null ? createNodeArray() : this.formatClassElements(members)
		);

		// Assign undefined to the heritageClauses if they are not defined
		if (classDeclaration.heritageClauses != null && classDeclaration.heritageClauses.length === 0) {
			classDeclaration.heritageClauses = undefined;
		}

		return classDeclaration;
	}

	/**
	 * Creates a ConstructorDeclaration from the provided options
	 * @param {string} body
	 * @param {Iterable<IParameterCtor>} parameters
	 * @returns {ConstructorDeclaration}
	 */
	public formatConstructor ({body, parameters}: IConstructorCtor): ConstructorDeclaration {
		return createConstructor(
			undefined,
			undefined,
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Creates a PropertyDeclaration from the provided options
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {boolean} isStatic
	 * @param {boolean} isOptional
	 * @param {boolean} isAbstract
	 * @param {VisibilityKind} visibility
	 * @param {boolean} isAsync
	 * @param {string} name
	 * @param {string} type
	 * @param {string} initializer
	 * @param {boolean} isReadonly
	 * @returns {PropertyDeclaration}
	 */
	public formatClassProperty ({decorators, isStatic, isOptional, isAbstract, visibility, isAsync, name, type, initializer, isReadonly}: IClassPropertyCtor): PropertyDeclaration {

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
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {string} body
	 * @param {Iterable<string>} typeParameters
	 * @param {boolean} isAsync
	 * @param {string} name
	 * @param {Iterable<IParameterCtor>} parameters
	 * @param {string} type
	 * @returns {ts.MethodDeclaration}
	 */
	public formatMethod ({decorators, body, typeParameters, isAsync, name, parameters, type}: IMethodCtor): MethodDeclaration {

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
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {string} type
	 * @param {Iterable<IParameterCtor>} parameters
	 * @param {string} name
	 * @param {boolean} isAsync
	 * @param {Iterable<string>} typeParameters
	 * @param {string} body
	 * @param {VisibilityKind} visibility
	 * @param {boolean} isStatic
	 * @param {boolean} isAbstract
	 * @param {boolean} isOptional
	 * @returns {MethodDeclaration}
	 */
	public formatClassMethod ({decorators, type, parameters, name, isAsync, typeParameters, body, visibility, isStatic, isAbstract, isOptional}: IClassMethodCtor): MethodDeclaration {

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
	 * @param {ClassAccessorCtor} accessor
	 * @returns {GetAccessorDeclaration | SetAccessorDeclaration}
	 */
	public formatClassAccessor (accessor: ClassAccessorCtor): GetAccessorDeclaration|SetAccessorDeclaration {
		if (accessor.kind === "GET") {
			return this.formatGetAccessor(accessor);
		} else {
			return this.formatClassSetAccessor(accessor);
		}
	}

	/**
	 * Formats a GetAccessor from the provided options
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {boolean} isAsync
	 * @param {boolean} isStatic
	 * @param {boolean} isAbstract
	 * @param {VisibilityKind} visibility
	 * @param {string} name
	 * @param {string} type
	 * @param {string} body
	 * @returns {ts.GetAccessorDeclaration}
	 */
	public formatClassGetAccessor ({decorators, isAsync, isStatic, isAbstract, visibility, name, type, body}: IClassGetAccessorCtor): GetAccessorDeclaration {

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
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {boolean} isStatic
	 * @param {boolean} isAbstract
	 * @param {VisibilityKind} visibility
	 * @param {string} name
	 * @param {string} body
	 * @param {Iterable<IParameterCtor>} parameters
	 * @returns {SetAccessorDeclaration}
	 */
	public formatClassSetAccessor ({decorators, isStatic, isAbstract, visibility, name, body, parameters}: IClassSetAccessorCtor): SetAccessorDeclaration {
		return createSetAccessor(
			decorators == null ? undefined : this.formatDecorators(decorators),
			this.formatModifiers({isStatic, isAbstract, visibility}),
			name,
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Formats the provided options into a GetAccessorDeclaration or a SetAccessorDeclaration
	 * @param {AccessorCtor} accessor
	 * @returns {GetAccessorDeclaration | SetAccessorDeclaration}
	 */
	public formatAccessor (accessor: AccessorCtor): GetAccessorDeclaration|SetAccessorDeclaration {
		if (isIGetAccessorCtor(accessor)) {
			return this.formatGetAccessor(accessor);
		} else {
			return this.formatSetAccessor(accessor);
		}
	}

	/**
	 * Formats a GetAccessor from the provided options
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {boolean} isAsync
	 * @param {string} type
	 * @param {string} body
	 * @param {string} name
	 * @returns {GetAccessorDeclaration}
	 */
	public formatGetAccessor ({decorators, isAsync, type, body, name}: IGetAccessorCtor): GetAccessorDeclaration {

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
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {string} name
	 * @param {string} body
	 * @param {Iterable<IParameterCtor>} parameters
	 * @returns {SetAccessorDeclaration}
	 */
	public formatSetAccessor ({decorators, name, body, parameters}: ISetAccessorCtor): SetAccessorDeclaration {

		return createSetAccessor(
			decorators == null ? undefined : this.formatDecorators(decorators),
			undefined,
			name,
			parameters == null ? createNodeArray() : this.formatParameters(parameters),
			body == null ? undefined : this.formatBlock(body)
		);
	}

	/**
	 * Formats a StringLiteral
	 * @param {string} literal
	 * @returns {StringLiteral}
	 */
	public formatStringLiteral (literal: string): StringLiteral {
		return createLiteral(literal);
	}

	/**
	 * Formats an ImportClause
	 * @param {Iterable<INamedImportExportCtor>} namedImports
	 * @param {string} namespace
	 * @param {string} defaultName
	 * @returns {ImportClause}
	 */
	public formatImportClause ({namedImports, namespace, defaultName}: IImportClauseCtor): ImportClause {
		// Create an identifier for the default name. The default name may already be an identifier
		const nameIdentifier = defaultName == null ? undefined : createIdentifier(defaultName);

		// Generate import specifiers for the named imports
		const namedImportImportSpecifiers = namedImports == null ? undefined : this.formatNamedImports(namedImports);

		// Generate a namespace import
		const namespaceImport = namespace == null ? undefined : this.formatNamespaceImport(namespace);

		return createImportClause(
			nameIdentifier,
			namespaceImport != null ? namespaceImport : namedImportImportSpecifiers
		);
	}

	/**
	 * Creates a new ImportDeclaration
	 * @param {string} path
	 * @param {Iterable<INamedImportExportCtor>} namedImports
	 * @param {string} namespace
	 * @param {string} defaultName
	 * @returns {ImportDeclaration}
	 */
	public formatImportDeclaration ({path, namedImports, namespace, defaultName}: IImportCtor): ImportDeclaration {

		return createImportDeclaration(
			undefined,
			undefined,
			this.formatImportClause({namedImports, namespace, defaultName}),
			// The path may already be a StringLiteral
			this.formatStringLiteral(path)
		);
	}

	/**
	 * Creates NamedImports from all of the provided named import names
	 * @param {INamedImportExportCtor | Iterable<INamedImportExportCtor>} namedImports
	 * @returns {NamedImports}
	 */
	public formatNamedImports (namedImports: INamedImportExportCtor|Iterable<INamedImportExportCtor>): NamedImports {
		if (isINamedImportExportCtor(namedImports)) {
			// Create identifiers for the named import
			const [namedImportIdentifier, propertyNameIdentifier] = this.createNamedImportExportIdentifiers(namedImports);

			// Create a NamedImport for it
			return createNamedImports(createNodeArray([createImportSpecifier(propertyNameIdentifier, namedImportIdentifier)]));

		}

		// Create identifiers for all of the named imports
		const importIdentifiers = [...namedImports].map(namedImport => this.createNamedImportExportIdentifiers(namedImport));
		const importSpecifiers = importIdentifiers.map(identifier => createImportSpecifier(identifier[1], identifier[0]));

		// Create NamedImports for them
		return createNamedImports(createNodeArray(importSpecifiers));
	}

	/**
	 * Creates NamedExports from all of the provided named import names
	 * @param {INamedImportExportCtor | Iterable<INamedImportExportCtor>} namedExports
	 * @returns {NamedExports}
	 */
	public formatNamedExports (namedExports: INamedImportExportCtor|Iterable<INamedImportExportCtor>): NamedExports {
		if (isINamedImportExportCtor(namedExports)) {
			// Create identifiers for the named import
			const [namedExportIdentifier, propertyNameIdentifier] = this.createNamedImportExportIdentifiers(namedExports);

			// Create NamedExports for it
			return createNamedExports(
				createNodeArray([createExportSpecifier(propertyNameIdentifier, namedExportIdentifier)])
			);

		}

		// Create identifiers for all of the named exports
		const exportIdentifiers = [...namedExports].map(namedImport => this.createNamedImportExportIdentifiers(namedImport));
		const exportSpecifiers = exportIdentifiers.map(identifier => createExportSpecifier(identifier[1], identifier[0]));

		// Create NamedExports for them
		return createNamedExports(createNodeArray(exportSpecifiers));
	}

	/**
	 * Creates a NamespaceImport with the provided name
	 * @param {string} namespaceName
	 * @returns {NamespaceImport}
	 */
	public formatNamespaceImport (namespaceName: string): NamespaceImport {
		// Create an identifier for the namespace import
		const namedImportIdentifier = createIdentifier(namespaceName);

		// Create a namespace import for it
		return createNamespaceImport(namedImportIdentifier);
	}

	/**
	 * Creates a Modifier from the provided ModifierKind
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
	public formatModifiers ({isAbstract, isAsync, isStatic, isReadonly, isConst, isExported, isDeclared, isDefault, visibility}: Partial<IAllModifiersCtor>): ModifiersArray {
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
				...exportModifier,
				...defaultModifier,
				...declareModifier,
				...visibilityModifier,
				...abstractModifier,
				...staticModifier,
				...asyncModifier,
				...readonlyModifier,
				...constModifier
			]
		);
	}

	/**
	 * Formats an expression
	 * @param {string} expression
	 * @returns {Expression}
	 */
	public formatExpression (expression: string): Expression {
		return this.parseService.parseExpression(expression);
	}

	/**
	 * Formats a Statement
	 * @param {string} statement
	 * @returns {Expression}
	 */
	public formatStatement (statement: string): Statement {
		return this.parseService.parseStatement(statement);
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
	 * @param {IDecoratorCtor} decorator
	 * @returns {Decorator}
	 */
	public formatDecorator (decorator: IDecoratorCtor): Decorator {

		const firstExpression = this.parseService.parseExpression(decorator.expression);
		return createDecorator(firstExpression);
	}

	/**
	 * Formats all of the provided DecoratorCtors into a NodeArray of Decorators
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @returns {NodeArray<Decorator>}
	 */
	public formatDecorators (decorators: Iterable<IDecoratorCtor>): NodeArray<Decorator> {
		return createNodeArray([...decorators].map(decorator => this.formatDecorator(decorator)));
	}

	/**
	 * Formats a BindingName from the provided BindingNameDit
	 * @param {BindingNameCtor} name
	 * @returns {BindingName}
	 */
	public formatBindingName (name: BindingNameCtor): BindingName {

		if (name.kind === "NORMAL") {
			return createIdentifier(name.name);
		}

		else if (name.kind === "ARRAY_BINDING") {
			return createArrayBindingPattern(
				createNodeArray(name.elements.map(element => element.kind === "OMITTED"
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
					element.propertyName == null ? undefined : element.propertyName,
					element.name,
					element.initializer == null ? undefined : this.formatExpression(element.initializer)
				)))
			);
		}
	}

	/**
	 * Generates a Parameter from the provided options
	 * @param {INormalBindingNameCtor | IObjectBindingNameCtor | IArrayBindingNameCtor} name
	 * @param {Iterable<IDecoratorCtor>} decorators
	 * @param {boolean} isRestSpread
	 * @param {boolean} isOptional
	 * @param {string} type
	 * @param {string} initializer
	 * @returns {ParameterDeclaration}
	 */
	public formatParameter ({name, decorators, isRestSpread, isOptional, type, initializer}: IParameterCtor): ParameterDeclaration {

		return createParameter(
			decorators == null ? undefined : this.formatDecorators(decorators),
			undefined,
			this.formatDotDotDotToken(isRestSpread),
			this.formatBindingName(name),
			this.formatQuestionToken(isOptional),
			type == null ? undefined : this.formatType(type),
			initializer == null ? undefined : this.formatExpression(initializer)
		);
	}

	/**
	 * Formats all of the provided parameters
	 * @param {Iterable<IParameterCtor>} parameters
	 * @returns {NodeArray<ParameterDeclaration>}
	 */
	public formatParameters (parameters: Iterable<IParameterCtor>): NodeArray<ParameterDeclaration> {
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
	 * @param {string} instructions
	 * @returns {Block}
	 */
	public formatBlock (instructions: string): Block {
		return this.parseService.parseBlock(instructions);
	}

	/**
	 * Creates a tuple of identifiers for NamedImports. The first item is for the name, the second is for the propertyName, if any is given.
	 * @param {INamedImportExportCtor} namedImport
	 * @returns {[Identifier , Identifier]}
	 */
	private createNamedImportExportIdentifiers (namedImport: INamedImportExportCtor): [Identifier, Identifier|undefined] {
		const namedImportExportIdentifier = createIdentifier(namedImport.name);
		const propertyNameIdentifier = namedImport.propertyName == null ? undefined : createIdentifier(namedImport.propertyName);
		return [namedImportExportIdentifier, propertyNameIdentifier];
	}
}